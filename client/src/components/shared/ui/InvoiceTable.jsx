import { styled } from "@mui/system";
import {
  TablePagination,
  tablePaginationClasses as classes,
} from "@mui/base/TablePagination";
import { format } from "date-fns";
import FlexCard from "./FlexCard";
import TableStyles from "./Tables.module.css";
import InvoicesTableStyles from "./InvoicesTable.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoDownload } from "react-icons/io5";
import authAxios from "api/authAxios";
import toast from "react-hot-toast";
import { BiDownload } from "react-icons/bi";

function InvoicesTable({ invoices }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoices.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadPDF = async (id) => {
    try {
      const downloadToast = toast.loading("Downloading Invoice...");
      const response = await authAxios.get(`/invoices/${id}/download`, {
        responseType: "blob",
      });
      if (response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${id}`);
        link.setAttribute("target", `_blank`);
        document.body.appendChild(link);
        toast.success("Done", {
          id: downloadToast,
        });
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Something went wrong", {
          id: downloadToast,
        });
      }
    } catch (error) {
      toast.error("Unable to download file");
      console.error(error);
    }
  };

  return (
    <FlexCard
      className={TableStyles.wrapper}
      sx={{ maxWidth: "100%", width: 500 }}
    >
      <div className={TableStyles.title}>
        <h3>Invoices</h3>
      </div>
      <div className={TableStyles.divider} />
      <table className={TableStyles.table} aria-label="custom pagination table">
        <thead className={TableStyles.thead}>
          <tr className={`${TableStyles.tr}`}>
            <th>#</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Recepient</th>
            <th>Due Date</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody className={TableStyles.tbody}>
          {(rowsPerPage > 0
            ? invoices.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : invoices
          ).map((invoice) => (
            <tr
              key={invoice.id}
              className={`${TableStyles.tr}`}
              onDoubleClick={() => navigate(`/invoices/edit/${invoice.id}`)}
            >
              <td>{invoices.indexOf(invoice) + 1}</td>
              <td>{invoice.description || ""}</td>
              <td>{`${invoice.currency} ${invoice.amount / 100}`}</td>
              <td>
                <div
                  className={`${InvoicesTableStyles.td_status} ${
                    invoice.paid ? InvoicesTableStyles.paid : ""
                  }`}
                >
                  {invoice.paid ? "Paid" : "Not Paid"}
                </div>
              </td>
              <td>{invoice.customer.email}</td>
              <td>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</td>
              <td className={InvoicesTableStyles.td_download}>
                <BiDownload
                  className={InvoicesTableStyles.icon}
                  onClick={() => downloadPDF(invoice.id)}
                />
              </td>
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
              count={invoices.length}
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

export default InvoicesTable;

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
