import * as React from "react";
import { styled } from "@mui/system";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { format } from "date-fns";
import FlexCard from "./FlexCard";
import TableStyles from "./Tables.module.css";
import TransactionTableStyles from "./TransactionTable.module.css";
import { useNavigate } from "react-router-dom";

function TransactionTable({ transactions }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <FlexCard
      className={TableStyles.wrapper}
      sx={{ maxWidth: "100%", width: 500 }}
    >
      <div className={TableStyles.title}>
        <h3>Transactions</h3>
      </div>
      <div className={TableStyles.divider} />
      <table className={TableStyles.table} aria-label="custom pagination table">
        <thead className={TableStyles.thead}>
          <tr className={`${TableStyles.tr}`}>
            <th>#</th>
            <th>Transaction</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Account</th>
            <th>From</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className={TableStyles.tbody}>
          {(rowsPerPage > 0
            ? transactions.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : transactions
          ).map((transaction) => (
            <tr
              key={transaction._id}
              className={`${TableStyles.tr}`}
              onDoubleClick={() =>
                navigate(`/transactions/edit/${transaction._id}`)
              }
            >
              <td>{transactions.indexOf(transaction) + 1}</td>
              <td>{transaction.description || ""}</td>
              {/* <td>{transaction._id}</td> */}
              <td>
                <div
                  className={`${TransactionTableStyles.td_type} ${
                    TransactionTableStyles[transaction.type]
                  }`}
                >
                  {transaction.type}
                </div>
              </td>
              <td>{transaction.amount}</td>
              <td>
                {transaction.type === "transfer"
                  ? transaction.destinationAccountID?.name
                  : transaction.accountID.name}
              </td>
              <td>
                {transaction.type != "transfer"
                  ? "---"
                  : transaction.accountID.name}
              </td>
              <td>{format(new Date(transaction.date), "MMM dd, yyyy")}</td>
            </tr>
          ))}
          {emptyRows > 0 && (
            <tr style={{ height: 41 * emptyRows }}>
              <td colSpan={3} aria-hidden />
            </tr>
          )}
        </tbody>
        <tfoot className={TableStyles.tfoot}>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </table>
    </FlexCard>
  );
}

export default TransactionTable;

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;
