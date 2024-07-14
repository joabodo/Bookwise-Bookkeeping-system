const AccountServices = require("../services/AccountServices");

/******************* UTILITY FUNCTIONS  ************************/

const logger = require("../lib/logger");
const { COMMANDS } = require("./constants");
const { setContext, deleteContext } = require("./contextHandler");
const telegram = require("./telegram");
const SUPPORTED_CURRENCIES = require("../config/constants/SUPPORTED_CURRENCIES");
const { z } = require("zod");
const PayStackAPI = require("paystack-api");

const isValidEmail = function (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const pauseThenSend = async function (chatId, botMessage, { options, time }) {
  setTimeout(
    async () => await telegram.sendMessage(chatId, botMessage, options),
    time
  );
};

const commandsList = Object.keys(COMMANDS).reduce((acc, command) => {
  return (acc += `\n${COMMANDS[command].VALUE} - ${COMMANDS[command].DESCRIPTION}`);
}, "\n");

/***************************************************************/

const help = async (chatID, payload = null, context = null) => {
  const THIS_COMMAND = COMMANDS.HELP.VALUE;
  const botMessage = `I can help you perform most tasks on you BookWise account.\n\nTo get started, use one of these commands:${commandsList}`;
  await telegram.sendMessage(chatID, botMessage, {
    reply_markup: {
      remove_keyboard: true,
    },
  });
};

const exit = async (chatID, payload, context) => {
  const THIS_COMMAND = COMMANDS.EXIT.VALUE;
  await deleteContext(chatID);
  const botMessage = `Available commands:${commandsList}`;
  await telegram.sendMessage(chatID, botMessage, {
    reply_markup: {
      remove_keyboard: true,
    },
  });
};

const accounts = async (chatID, payload, context) => {
  logger.trace(`[TELEGRAM] [COMMANDS] [ACCOUNTS] - Called`);
  THIS_COMMAND = COMMANDS.ACCOUNTS.VALUE;
  if (!context || context?.currCommand !== THIS_COMMAND) {
    // First call
    context = {
      currCommand: THIS_COMMAND,
      data: {
        action: "",
        step: 1,
      },
    };
    await setContext(chatID, context);
    await telegram.sendMessage(chatID, `What would you like to do:\n`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Create Account", callback_data: "account.create" }],
          [{ text: "Edit Account", callback_data: "account.edit" }],
          [{ text: "Delete Account", callback_data: "account.delete" }],
        ],
      },
    });
  } else {
    // If there is no inital choice, push callback data from inline button
    if (!context.data.action) {
      if (!payload.callbackQuery?.data) {
        await telegram.sendMessage(
          chatID,
          `Please select from the provided options:\n`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Create Account", callback_data: "account.create" }],
                [{ text: "Edit Account", callback_data: "account.edit" }],
                [{ text: "Delete Account", callback_data: "account.delete" }],
              ],
            },
          }
        );
      }
      context.data.action = payload.callbackQuery.data;
    }
    switch (context.data.action) {
      case "account.create":
        // Use answercallback since inline keyboard was used
        switch (context.data.step) {
          case 1:
            // Init account creation
            telegram.answerCallbackQuery(payload.callbackQuery.id);
            await telegram.sendMessage(chatID, "Let's add a new Account");
            await pauseThenSend(
              chatID,
              "What would you like to call the Account?",
              { time: 1000 }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          case 2:
            // Record Name
            const accountName = payload.message.text;
            const exists = await AccountServices.accountExists({
              name: accountName,
              userID: payload.user._id,
            });
            if (exists) {
              return await telegram.sendMessage(
                chatID,
                "Looks like an account with that name already exist. Let's try picking another name."
              );
            }
            context.data.name = accountName;
            await telegram.sendMessage(
              chatID,
              `What currency does the account operate on?`,
              {
                reply_markup: {
                  inline_keyboard: [
                    SUPPORTED_CURRENCIES.map((curr) => ({
                      text: curr,
                      callback_data: curr,
                    })),
                  ],
                },
              }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          case 3:
            if (!payload.callbackQuery?.data) {
              return await telegram.sendMessage(
                chatID,
                `Please select from the provided options\n`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      SUPPORTED_CURRENCIES.map((curr) => ({
                        text: curr,
                        callback_data: curr,
                      })),
                    ],
                  },
                }
              );
            } else {
              context.data.currency = payload.callbackQuery.data;
              telegram.answerCallbackQuery(payload.callbackQuery.id);
              await telegram.sendMessage(
                chatID,
                `What is the account to be used for?`
              );
              context.data.step++;
              await setContext(chatID, context);
            }
            break;
          case 4:
            const description = payload.message.text;
            const { name, currency } = context.data;
            const userID = payload.user._id;
            const newAccount = await AccountServices.createAccount({
              name,
              currency,
              description,
              userID,
              slug: name.toLowerCase().split(" ").join("-"),
            });
            if (newAccount) {
              await telegram.sendMessage(
                chatID,
                `Your account has been added, Here's the details:\n\nName: ${newAccount.name}\nCurrency: ${newAccount.currency}\nDescription: ${newAccount.description}`
              );
              await deleteContext(chatID);
            }
            break;
        }
        break;
      case "account.edit":
        switch (context.data.step) {
          // List all accounts for the user
          case 1:
            telegram.answerCallbackQuery(payload.callbackQuery.id);
            const { data: accounts } = await AccountServices.getAccounts({
              userID: payload.user._id,
            });
            await telegram.sendMessage(
              chatID,
              `Which account would you like to update?`,
              {
                reply_markup: {
                  inline_keyboard: accounts.map((account) => [
                    { text: account.name, callback_data: account._id },
                  ]),
                },
              }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // List all updateable properties for the account
          case 2:
            if (!payload.callbackQuery?.data) {
              const { data: accounts } = await AccountServices.getAccounts({
                userID: payload.user._id,
              });
              return await telegram.sendMessage(
                chatID,
                `Please select from the provided options\n`,
                {
                  reply_markup: {
                    inline_keyboard: accounts.map((account) => [
                      { text: account.name, callback_data: account._id },
                    ]),
                  },
                }
              );
            } else {
              const accountID = payload.callbackQuery.data;
              context.data.accountID = accountID;
              telegram.answerCallbackQuery(payload.callbackQuery.id);
              await telegram.sendMessage(
                chatID,
                `What would you like to update?`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: "Name", callback_data: "name" },
                        { text: "Currency", callback_data: "currency" },
                        { text: "Description", callback_data: "description" },
                      ],
                    ],
                  },
                }
              );
              context.data.step++;
              await setContext(chatID, context);
            }
            break;
          // Get Update
          case 3:
            if (!payload.callbackQuery?.data) {
              return await telegram.sendMessage(
                chatID,
                `Please select from the provided options:\n`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: "Name", callback_data: "name" },
                        { text: "Currency", callback_data: "currency" },
                        { text: "Description", callback_data: "description" },
                      ],
                    ],
                  },
                }
              );
            } else {
              const property = payload.callbackQuery.data;
              context.data.updateProperty = property;
              telegram.answerCallbackQuery(payload.callbackQuery.id);
              const options =
                property === "currency"
                  ? {
                      reply_markup: {
                        inline_keyboard: [
                          SUPPORTED_CURRENCIES.map((currency) => ({
                            text: currency,
                            callback_data: currency,
                          })),
                        ],
                      },
                    }
                  : {};
              await telegram.sendMessage(
                chatID,
                `What would you like to change it to?`,
                options
              );
              //   Initialize update object
              context.data.updates = {};
              context.data.step++;
              await setContext(chatID, context);
            }
            break;
          // Store update in context
          // Confirm for additional updates
          case 4:
            const { updateProperty } = context.data;
            let value;
            if (updateProperty === "currency") {
              if (!payload.callbackQuery?.data) {
                return await telegram.sendMessage(
                  chatID,
                  `Please select from the provided options\n`,
                  {
                    reply_markup: {
                      inline_keyboard: [
                        SUPPORTED_CURRENCIES.map((curr) => ({
                          text: curr,
                          callback_data: curr,
                        })),
                      ],
                    },
                  }
                );
              } else {
                telegram.answerCallbackQuery(payload.callbackQuery.id);
                value = payload.callbackQuery.data;
              }
            } else {
              value = payload.message.text;
            }
            context.data.updates[updateProperty] = value;
            await telegram.sendMessage(
              chatID,
              `Here's a summary of your updates:\n${Object.keys(
                context.data.updates
              ).map(
                (property, i) =>
                  `\n${i + 1}. New ${property}: ${
                    context.data.updates[property]
                  }`
              )}`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: "Save", callback_data: "true" },
                      { text: "Cancel", callback_data: "false" },
                    ],
                  ],
                },
              }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // Show account summary and save confirmation
          case 5:
            if (!payload.callbackQuery?.data) {
              return await telegram.sendMessage(
                chatID,
                `Here's a summary of your updates:\n${Object.keys(
                  context.data.updates
                ).map(
                  (property, i) =>
                    `\n${i + 1}. New ${property}: ${
                      context.data.updates[property]
                    }`
                )}`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: "Save", callback_data: "true" },
                        { text: "Cancel", callback_data: "false" },
                      ],
                    ],
                  },
                }
              );
            } else {
              telegram.answerCallbackQuery(payload.callbackQuery.id);
              const save = payload.callbackQuery.data === "true";
              if (save) {
                const updatedAccount = AccountServices.patchAccount(
                  context.data.accountID,
                  context.data.updates
                );
                if (updatedAccount) {
                  await telegram.sendMessage(
                    chatID,
                    "Changes to your account have been saved"
                  );
                }
              } else {
                await telegram.sendMessage(chatID, "Update Canceled");
              }
              deleteContext(chatID);
            }
            break;
        }
        break;
    }
  }
};

const invoices = async (chatID, payload, context) => {
  logger.trace(`[TELEGRAM] [COMMANDS] [INVOICES] - Called`);
  THIS_COMMAND = COMMANDS.INVOICES.VALUE;
  // Verify that the user has invoices enabled
  const { paymentsEnabled } = payload.user;
  if (!paymentsEnabled) {
    return await telegram.sendMessage(
      chatID,
      `You don't seem to have invoicing enabled for this account. To activate it, visit https://www.bookwise.com/invoices to get started.`
    );
  }

  // If payments is enabled, proceed

  if (!context || context?.currCommand !== THIS_COMMAND) {
    // First call
    context = {
      currCommand: THIS_COMMAND,
      data: {
        action: "",
        step: 1,
      },
    };
    await setContext(chatID, context);
    await telegram.sendMessage(chatID, `What would you like to do:\n`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Send an Invoice", callback_data: "invoice.create" }],
          [{ text: "Edit an Invoice", callback_data: "invoice.edit" }],
          [{ text: "Delete an Invoice", callback_data: "invoice.delete" }],
        ],
      },
    });
  } else {
    if (!context.data.action) {
      if (!payload?.callbackQuery?.data) {
        // User did not select any option
        // Resend list
        await telegram.sendMessage(
          chatID,
          `Please select from the available options:\n`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Send an Invoice", callback_data: "invoice.create" }],
                [{ text: "Edit an Invoice", callback_data: "invoice.edit" }],
                [
                  {
                    text: "Delete an Invoice",
                    callback_data: "invoice.delete",
                  },
                ],
              ],
            },
          }
        );
      }
      context.data.action = payload.callbackQuery.data;
    }
    // User has selected an option
    // Identify selected action
    // Proceed starting from step 1 and incrementing the step counter where needed
    switch (context.data.action) {
      case "invoice.create":
        switch (context.data.step) {
          // 1.Get Recepient email
          case 1:
            telegram.answerCallbackQuery(payload.callbackQuery.id);
            await telegram.sendMessage(
              chatID,
              "Okay. I'll need some more info to send the invoice..."
            );
            await pauseThenSend(
              chatID,
              "What email would you like me to send this invoice to?",
              { time: 1000 }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 2. Get Currency
          case 2:
            // Verify email
            const email = payload.message.text;
            const emailValid = isValidEmail(email);
            if (!emailValid) {
              return await telegram.sendMessage(
                chatID,
                `The email "*${email}*" seems not to have the right format. Please send a valid email`
              );
            }
            context.data.email = email;
            await telegram.sendMessage(
              chatID,
              `What currency are you charging in?`,
              {
                reply_markup: {
                  inline_keyboard: [
                    SUPPORTED_CURRENCIES.map((curr) => ({
                      text: curr,
                      callback_data: curr,
                    })),
                  ],
                },
              }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 3. Verify currency then get amount (multiples of hundreds)
          case 3:
            if (!payload.callbackQuery?.data) {
              return await telegram.sendMessage(
                chatID,
                `Please select from the provided options\n`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      SUPPORTED_CURRENCIES.map((curr) => ({
                        text: curr,
                        callback_data: curr,
                      })),
                    ],
                  },
                }
              );
            }
            // Continue if currency is valid
            context.data.currency = payload.callbackQuery.data;
            await telegram.sendMessage(
              chatID,
              "How much would you like to charge?\n\nRemember to give the amount in the subunit of your currency.\nE.g 100 = KES 1"
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 4. Get description
          case 4:
            // Verify that amount is a valid number;
            const amount = Number(payload.message.text);
            if (amount === NaN) {
              return await telegram.sendMessage(
                chatID,
                "Please enter a valid number as the amount"
              );
            }
            // Continue if amount is valid
            context.data.amount = amount;
            await telegram.sendMessage(
              chatID,
              "Please enter a name or description for this invoice"
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 5. Get Due Date
          case 5:
            const description = payload.message.text;
            context.data.description = description;
            await telegram.sendMessage(
              chatID,
              `Please enter a due date in the format YYYY-MM-DD\nE.g: 2024-04-27`
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 6. Confirm Invoice
          case 6:
            // Verify date format
            const dueDate = payload.message.text;
            const dateValidation = z.string().date().safeParse(dueDate);
            if (!dateValidation.success) {
              return await telegram.sendMessage(
                chatID,
                "Please enter a valid date in the format 'YYYY-MM-DD'"
              );
            }
            context.data.dueDate = dueDate;
            await telegram.sendMessage(
              chatID,
              `Here's a summary of the invoice:\n\nRecipient Email: ${
                context.data.email
              }\nAmount: ${context.data.currency} ${(
                context.data.amount / 100
              ).toFixed(2)}\nDescription: ${
                context.data.description
              }\nDue Date: ${context.data.dueDate}`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: "Send Invoice", callback_data: "send" },
                      { text: "Cancel", callback_data: "cancel" },
                    ],
                  ],
                },
              }
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 7. Send Invoice
          case 7:
            if (
              !payload.callbackQuery?.data ||
              (payload.callbackQuery.data !== "send" &&
                payload.callbackQuery.data !== "cancel")
            ) {
              return await telegram.sendMessage(
                chatID,
                `Here's a summary of the invoice:\n\nRecipient Email: ${
                  context.data.email
                }\nAmount: ${context.data.currency} ${(
                  context.data.amount / 100
                ).toFixed(2)}\nDescription: ${
                  context.data.description
                }\nDue Date: ${context.data.dueDate}`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        { text: "Send Invoice", callback_data: "send" },
                        { text: "Cancel", callback_data: "cancel" },
                      ],
                    ],
                  },
                }
              );
            }
            // Continue if valid response
            telegram.answerCallbackQuery(payload.callbackQuery.id);
            const send = payload.callbackQuery.data === "send";
            if (send) {
              // Send Invoice
              const { paystackKey } = payload.user;
              const paystack = PayStackAPI(paystackKey);
              const { email, currency, amount, description, dueDate } =
                context.data;

              try {
                const { data: customer } = await paystack.customer.create({
                  email,
                });
                const invoice = await paystack.invoice.create({
                  amount,
                  description,
                  currency,
                  due_date: dueDate,
                  customer: customer.customer_code,
                });
                if (invoice) {
                  await telegram.sendMessage(chatID, "Invoice has been sent");
                }
              } catch (error) {
                logger.error(
                  error,
                  `[TELEGRAM] [COMMANDS] - Encountered and error`
                );
                await telegram.sendMessage(
                  chatID,
                  "Oops...Something went wrong"
                );
              } finally {
                await deleteContext(chatID);
              }
            } else {
              await deleteContext(chatID);
              await telegram.sendMessage(chatID, "Operation cancelled");
            }
            break;
        }

        break;
      case "invoice.edit":
        switch (context.data.step) {
          // 1. Get recepient email for search
          case 1:
            telegram.answerCallbackQuery(payload.callbackQuery.id);
            await telegram.sendMessage(
              chatID,
              "To edit an invoice, kindly provide me with the recepients email so I can list all editable Invoices sent (invoices which have not been paid for)"
            );
            context.data.step++;
            await setContext(chatID, context);
            break;
          // 2. List all invoices for the given customer that are not paid
          case 2:
            // Validate Email
            const email = payload.message.text;
            const validateEmail = z.string().email().safeParse(email);
            if (!validateEmail.success) {
              return await telegram.sendMessage(
                chatID,
                `It seems the email '${email}' is not a valid email. Please provide a valid email to get started.`
              );
            }
            // Continue if valid email
            const { paystackKey } = payload.user;
            const paystack = PayStackAPI(paystackKey);
            try {
              const customer = await paystack.customer.create({
                email,
              });
              context.data.page = 1;
              const { data: invoices, meta } = await paystack.invoice.list({
                customer: customer.customer_code,
                perPage: 1,
                page: context.data.page,
              });

              if (invoices && invoices.length > 0) {
                const hasMore = meta.pageCount > meta.page;
                const controls = [
                  { text: "", callback_data: "" },
                  { text: "", callback_data: "" },
                ];
                if (context.data.page > 1)
                  controls[0] = { text: "<<", callback_data: "prev" };
                if (hasMore)
                  controls[1] = { text: ">>", callback_data: "next" };
                console.log([...controls]);
                context.data.invoiceListMessage = await telegram.sendMessage(
                  chatID,
                  `Here's a list of editable invoices sent to '${email}':`,
                  {
                    reply_markup: {
                      inline_keyboard: [
                        ...invoices.map((invoice) => [
                          {
                            text: `${invoice.description}: ${
                              invoice.currency
                            } ${(invoice.amount / 100).toFixed(2)}`,
                            callback_data: String(invoice.id),
                          },
                        ]),
                        controls,
                      ],
                    },
                  }
                );
              } else {
                return await telegram.sendMessage(
                  chatID,
                  "I'm unable to find any invoice with that recepient. You can send an invoice to them by using /invoices and navigating to 'Edit an Invoice' or you can cancel this operation using /exit."
                );
              }
            } catch (error) {
              logger.error(
                error,
                `[TELEGRAM] [COMMANDS] - encountered an error`
              );
              return await telegram.sendMessage(
                chatID,
                "I'm unable to find any invoice with that recepient. You can send an invoice to them by using /invoices and navigating to 'Edit Invoice'."
              );
            }
            break;
          // 3. List updatable properties
          case 3:
            break;
          // 4. Get Updated value
          case 4:
            break;
          // 5. Show summary
          case 5:
            break;
          // 6. Save
          case 6:
            break;
        }
        break;
      case "invoice.delete":
        break;
    }
  }
};

help.command = COMMANDS.HELP.VALUE;
exit.command = COMMANDS.EXIT.VALUE;
accounts.command = COMMANDS.ACCOUNTS.VALUE;
invoices.command = COMMANDS.INVOICES.VALUE;

const operationsArr = [help, exit, accounts, invoices];

const runCommand = async (command, chatID, payload, context = null) => {
  const operation = operationsArr.find(
    (operation) => operation.command === command
  );
  if (operation) {
    operation(chatID, payload, context);
  } else {
    const botMessage = `Unfortunately I don't recognize that command. Here's a list of commands available:${commandsList}`;
    await telegram.sendMessage(chatID, botMessage, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
};

module.exports = runCommand;
