// import useAuth from "hooks/context/auth/useAuth";
import styles from "./DashboardPage.module.css";
import GridSection from "components/shared/GridSection";
import {
  FlexCard,
  Header,
  Loader,
  TransactionTable,
} from "components/shared/ui";
import { useTransactionsQuery } from "hooks/tanstack/transactions";
import { LineChart } from "@mui/x-charts";
import { green, red } from "@mui/material/colors";
import { format, sub } from "date-fns";
import { useEffect, useState } from "react";
import { Toggle, ToggleItem } from "components/shared/toggle";

function DashboardPage() {
  const [cashflowDuration, setCashflowDuration] = useState("week");
  const [dateRange, setDateRange] = useState({
    from: sub(
      new Date(),
      cashflowDuration === "week" ? { days: 6 } : { months: 1 }
    ),
    to: new Date(),
  });
  const { data: transactions } = useTransactionsQuery({
    from: format(dateRange.from, "yyyy-MM-dd"),
    to: format(dateRange.to, "yyyy-MM-dd"),
    type: ["income", "expense"],
  });
  useEffect(() => {
    setDateRange({
      from: sub(
        new Date(),
        cashflowDuration === "week" ? { days: 6 } : { months: 1 }
      ),
      to: new Date(),
    });
  }, [cashflowDuration]);
  const calculateCumulativeTotals = () => {
    const groupedByDay = transactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd"); // Extract the date in YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = { totalIncome: 0, totalExpense: 0 };
      }
      if (transaction.type === "income") {
        acc[date].totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        acc[date].totalExpense += transaction.amount;
      }
      return acc;
    }, {});

    // Step 2: Determine date range
    const allDates = [];
    const range = cashflowDuration === "week" ? 6 : 30;
    for (let currDiff = range; currDiff >= 0; currDiff--) {
      const date = format(sub(new Date(), { days: currDiff }), "yyyy-MM-dd");
      allDates.push(date);
    }

    // Step 3: Calculate cumulative totals
    const result = [];
    let cumulativeIncome = 0;
    let cumulativeExpense = 0;

    allDates.forEach((date, index) => {
      // console.log(date);
      const dailyTotal = groupedByDay[date] || {
        totalIncome: 0,
        totalExpense: 0,
      };
      // console.log(dailyTotal);
      cumulativeIncome += dailyTotal.totalIncome;
      cumulativeExpense += dailyTotal.totalExpense;
      result.push({
        index,
        date,
        totalIncome: cumulativeIncome,
        totalExpense: cumulativeExpense,
      });
    });
    return result;
  };
  const cumulativeTransactions = transactions
    ? calculateCumulativeTotals()
    : [];

  const totalIncome =
    cumulativeTransactions[cumulativeTransactions.length - 1]?.totalIncome || 0;
  const totalProfit =
    cumulativeTransactions[cumulativeTransactions.length - 1]?.totalIncome -
      cumulativeTransactions[cumulativeTransactions.length - 1]?.totalExpense ||
    0;

  const getDate = (index) =>
    cumulativeTransactions.find((transaction) => transaction.index == index)
      ?.date || "";
  return (
    <>
      <Header />
      <GridSection>
        <FlexCard className={styles.cashflow}>
          {transactions ? (
            <>
              {" "}
              <div className={styles.cashflowHeader}>
                <h3>Cashflow Summary</h3>
                <Toggle>
                  <ToggleItem
                    isDefault={cashflowDuration == "week"}
                    onClick={() => setCashflowDuration("week")}
                  >
                    Week
                  </ToggleItem>
                  <ToggleItem
                    isDefault={cashflowDuration == "month"}
                    onClick={() => setCashflowDuration("month")}
                  >
                    Month
                  </ToggleItem>
                </Toggle>
              </div>
              <div className={styles.divider} />
              <div className={styles.lineChartContainer}>
                <LineChart
                  dataset={cumulativeTransactions}
                  xAxis={[
                    {
                      dataKey: "index",
                      valueFormatter: (value) => {
                        const date = getDate(value);
                        console.log(date);
                        return date === ""
                          ? ""
                          : format(
                              new Date(date),
                              cashflowDuration === "week" ? "EEE" : "MMM-dd"
                            );
                      },
                      // min: 1985,
                      // max: 2022,
                    },
                  ]}
                  series={[
                    {
                      dataKey: "totalIncome",
                      showMark: false,
                      color: green.A700,
                      curve: "catmullRom",
                      area: true,
                    },
                    {
                      dataKey: "totalExpense",
                      showMark: false,
                      color: red.A400,
                      curve: "catmullRom",
                      area: true,
                    },
                  ]}
                  sx={() => ({
                    [`.MuiAreaElement-root`]: { opacity: 0.1 },
                  })}
                />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </FlexCard>
        <FlexCard className={styles.figureCard}>
          {transactions ? (
            <>
              <h3>Net Profit</h3>
              <div className={styles.info}>
                <span
                  className={`heading-1 ${
                    totalProfit < 0
                      ? "text-error-red"
                      : totalProfit > 0
                      ? "text-success-green"
                      : ""
                  }`}
                >{`${totalProfit < 0 ? "-" : ""}$${Math.abs(
                  totalProfit
                ).toFixed(2)}`}</span>
                <span className="small-text">
                  From {format(new Date(dateRange.from), "MMM dd, yyyy")} to{" "}
                  {format(new Date(dateRange.to), "MMM dd, yyyy")}
                </span>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </FlexCard>
        <FlexCard className={styles.figureCard}>
          {transactions ? (
            <>
              <h3>Total Income</h3>
              <div className={styles.info}>
                <span className="heading-1">{`$${totalIncome.toFixed(
                  2
                )}`}</span>
                <span className="small-text">
                  From {format(new Date(dateRange.from), "MMM dd, yyyy")} to{" "}
                  {format(new Date(dateRange.to), "MMM dd, yyyy")}
                </span>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </FlexCard>
      </GridSection>
      <GridSection>
        {transactions && <TransactionTable transactions={transactions} />}
      </GridSection>
    </>
  );
}

export default DashboardPage;
