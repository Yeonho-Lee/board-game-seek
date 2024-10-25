"use client";

import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for boardgames
const boardgames = [
    { id: 1, name: "Gloomhaven", rating: 8.8, playerCount: "1-4", playTime: "60-120" },
    { id: 2, name: "Pandemic Legacy: Season 1", rating: 8.6, playerCount: "2-4", playTime: "60" },
    { id: 3, name: "Brass: Birmingham", rating: 8.7, playerCount: "2-4", playTime: "60-120" },
    { id: 4, name: "Terraforming Mars", rating: 8.4, playerCount: "1-5", playTime: "120" },
    { id: 5, name: "Twilight Imperium (Fourth Edition)", rating: 8.7, playerCount: "3-6", playTime: "240-480" },
    { id: 6, name: "Star Wars: Rebellion", rating: 8.4, playerCount: "2-4", playTime: "180-240" },
    { id: 7, name: "7 Wonders", rating: 7.8, playerCount: "2-7", playTime: "30" },
    { id: 8, name: "Ticket to Ride", rating: 7.5, playerCount: "2-5", playTime: "30-60" },
    { id: 9, name: "Carcassonne", rating: 7.4, playerCount: "2-5", playTime: "30-45" },
    { id: 10, name: "Codenames", rating: 7.7, playerCount: "2-8", playTime: "15" },
];

type Boardgame = (typeof boardgames)[number];

export default function BoardgameRankings() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const columns: ColumnDef<Boardgame>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "Rank",
            cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Name
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "rating",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Rating
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("rating")}</div>,
        },
        {
            accessorKey: "playerCount",
            header: "Players",
            cell: ({ row }) => <div className="text-center">{row.getValue("playerCount")}</div>,
        },
        {
            accessorKey: "playTime",
            header: "Play Time",
            cell: ({ row }) => <div className="text-center">{row.getValue("playTime")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const boardgame = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(boardgame.name)}>
                                Copy game name
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Add to collection</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: boardgames,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter games..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
                    row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
