/** @format */

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import clsx from "clsx";

// ✅ No Vite error — declare SortingState yourself
type SortingState = {
  id: string;
  desc: boolean;
}[];

type DataRow = {
  jobRequest: string;
  submitted: string;
  status: string;
  submitter: string;
  url: string;
  assigned: string;
  priority: string;
  dueDate: string;
  estValue: string;
};

const data: DataRow[] = [
  {
    jobRequest: "Launch social media campaign for product",
    submitted: "15-11-2024",
    status: "In-process",
    submitter: "Aisha Patel",
    url: "www.aishapatel.com",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "20-11-2024",
    estValue: "6,200,000 ₹",
  },
  {
    jobRequest: "Update press kit for company redesign",
    submitted: "28-10-2024",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "www.irfankhan.org",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "30-10-2024",
    estValue: "3,500,000 ₹",
  },
  {
    jobRequest: "Finalize user testing feedback for app",
    submitted: "05-12-2024",
    status: "In-process",
    submitter: "Mark Johnson",
    url: "www.markjohnson.com",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "10-12-2024",
    estValue: "4,750,000 ₹",
  },
  {
    jobRequest: "Design new features for the website",
    submitted: "10-01-2025",
    status: "Complete",
    submitter: "Emily Green",
    url: "www.emilygreen.com",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "15-01-2025",
    estValue: "5,900,000 ₹",
  },
  {
    jobRequest: "Prepare financial report for Q4",
    submitted: "25-01-2025",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "www.jessicabrown.com",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "30-01-2025",
    estValue: "2,800,000 ₹",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    "In-process": "bg-yellow-100 text-yellow-800",
    "Need to start": "bg-blue-100 text-blue-800",
    Complete: "bg-green-100 text-green-800",
    Blocked: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-semibold",
        colorMap[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </span>
  );
};

const PriorityText = ({ priority }: { priority: string }) => {
  const colorMap: Record<string, string> = {
    High: "text-red-600 font-semibold",
    Medium: "text-yellow-600 font-semibold",
    Low: "text-blue-600 font-semibold",
  };
  return <span className={clsx(colorMap[priority])}>{priority}</span>;
};

export default function Spreadsheet() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showToolbar, setShowToolbar] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const toggleColumn = (colId: string) => {
    setHiddenColumns((prev) =>
      prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]
    );
  };

  const handleSort = () => {
    setSorting([{ id: "jobRequest", desc: false }]);
  };

  const handleCellView = () => {
    console.log("Cell View clicked");
  };

  const tabs = ["All Orders", "Pending", "Reviewed", "Approved", "Rejected"];

  useEffect(() => {
    if (activeTab === "Pending") {
      setGlobalFilter("Need to start");
    } else if (activeTab === "Approved") {
      setGlobalFilter("Complete");
    } else {
      setGlobalFilter("");
    }
  }, [activeTab]);

  const columns: ColumnDef<DataRow, any>[] = [
    {
      id: "jobRequest",
      header: "Job Request",
      accessorKey: "jobRequest",
      enableSorting: true,
    },
    {
      id: "submitted",
      header: "Submitted",
      accessorKey: "submitted",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true,
      cell: (info) => <StatusBadge status={info.getValue() as string} />,
    },
    {
      id: "submitter",
      header: "Submitter",
      accessorKey: "submitter",
      enableSorting: true,
    },
    {
      id: "url",
      header: "URL",
      accessorKey: "url",
      enableSorting: true,
      cell: (info) => (
        <a
          href={`https://${info.getValue() as string}`}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {info.getValue() as string}
        </a>
      ),
    },
    {
      id: "assigned",
      header: "Assigned",
      accessorKey: "assigned",
      enableSorting: true,
    },
    {
      id: "priority",
      header: "Priority",
      accessorKey: "priority",
      enableSorting: true,
      cell: (info) => <PriorityText priority={info.getValue() as string} />,
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessorKey: "dueDate",
      enableSorting: true,
    },
    {
      id: "estValue",
      header: "Est. Value",
      accessorKey: "estValue",
      enableSorting: true,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility: Object.fromEntries(
        columns.map((col) => [col.id!, !hiddenColumns.includes(col.id!)])
      ),
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Tool Bar
            </button>
            <button
              onClick={() => toggleColumn("dueDate")}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Hide Fields
            </button>
            <button
              onClick={handleSort}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Sort
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Filter
            </button>
            <button
              onClick={handleCellView}
              className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Cell View
            </button>
          </div>
        </div>
      )}

      {/* Global Search */}
      {showFilter && (
        <div>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border rounded px-4 py-2 text-sm w-full md:w-1/3"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "py-2 px-3 text-sm border-b-2",
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left border-b font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={clsx(
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                  "hover:bg-gray-100"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 border-b">
                    {flexRender(
                      cell.column.columnDef.cell ?? (() => cell.getValue()),
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
