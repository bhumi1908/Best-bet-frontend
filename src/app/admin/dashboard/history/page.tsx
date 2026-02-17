"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Plus,
    Edit,
    Trash2,
    Download,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { Popup } from "@/components/ui/Popup";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
    getAllGameHistoriesThunk,
    createGameHistoryThunk,
    updateGameHistoryThunk,
    deleteGameHistoryThunk,
} from "@/redux/thunk/gameHistoryThunk";
import { setFilters, setPagination } from "@/redux/slice/gameHistorySlice";
import { getAllStatesThunk } from "@/redux/thunk/statesThunk";
import { getAllGameTypesThunk } from "@/redux/thunk/gameTypesThunk";
import { GameHistory, CreateGameHistoryPayload, UpdateGameHistoryPayload, State, GameType } from "@/types/gameHistory";
import { gameHistoryFormSchema } from "@/utilities/schema";
import {
    formatDateShort,
    formatISODate,
    getDrawTimeLabel,
    // COMMENTED OUT: Result Status flow
    // getResultBadge,
    // getResultLabel,
    formatCurrency,
} from "@/utilities/formatting";
import { WinningNumbers } from "@/components/ui/WinningNumbers";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/Tooltip";
import * as XLSX from "xlsx";

// COMMENTED OUT: Result Status flow
// const RESULT_LABELS: Record<string, string> = {
//     all: "All Results",
//     WIN: "Win",
//     LOSS: "Loss",
//     PENDING: "Pending",
// };

// Formik form values type (allows empty values for placeholders)
type FormValues = {
    state_id: number;
    game_id: number;
    draw_date: string;
    draw_time: "" | "MID" | "EVE";
    winning_numbers: string;
    // COMMENTED OUT: Result Status flow
    // result: "" | "WIN" | "LOSS" | "PENDING";
    prize_amount: number | "";
};



export default function HistoryPage() {
    const dispatch = useAppDispatch();

    // Redux state
    const { gameHistories, pagination, filters, isLoading, error } = useAppSelector((state) => state.gameHistory);
    const { states } = useAppSelector((state) => state.states);
    const { gameTypes } = useAppSelector((state) => state.gameTypes);

    // Local state
    const [isDeleting, setIsDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<GameHistory | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    // COMMENTED OUT: Result Status flow
    // const [resultFilter, setResultFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // Formik for create/edit
    const formik = useFormik<FormValues>({
        initialValues: {
            state_id: 0,
            game_id: 0,
            draw_date: "",
            draw_time: "",
            winning_numbers: "",
            // COMMENTED OUT: Result Status flow
            // result: "",
            prize_amount: "",
        },
        validate: zodFormikValidate(gameHistoryFormSchema),
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Convert prize_amount to number (handle empty string -> 0)
                const prizeAmount = typeof values.prize_amount === "string"
                    ? (values.prize_amount === "" ? 0 : parseFloat(values.prize_amount) || 0)
                    : values.prize_amount || 0;

                const payload: CreateGameHistoryPayload = {
                    state_id: values.state_id,
                    game_id: values.game_id,
                    draw_date: values.draw_date,
                    draw_time: values.draw_time as "MID" | "EVE",
                    winning_numbers: values.winning_numbers,
                    // COMMENTED OUT: Result Status flow
                    // result: values.result as "WIN" | "LOSS" | "PENDING",
                    prize_amount: prizeAmount,
                };

                if (selectedHistory) {
                    // Update
                    await dispatch(updateGameHistoryThunk({ id: selectedHistory.id, data: payload })).unwrap();
                    toast.success("Game history updated successfully");
                    setDialogOpen(false);
                    // Refetch data to ensure consistency
                    await dispatch(
                        getAllGameHistoriesThunk({
                            page: pagination.page,
                            limit: pagination.limit,
                            filters,
                        })
                    );
                } else {
                    // Create
                    await dispatch(createGameHistoryThunk(payload)).unwrap();
                    toast.success("Game history created successfully");
                    setDialogOpen(false);
                    // Refetch data to update pagination correctly
                    // Always go to page 1 to see the newly created item
                    dispatch(setPagination({ page: 1 }));
                    await dispatch(
                        getAllGameHistoriesThunk({
                            page: 1,
                            limit: pagination.limit,
                            filters,
                        })
                    );
                }
                resetForm();
                setSelectedHistory(null);
            } catch (error: any) {
                toast.error(error?.message || "Failed to save game history");
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Handlers
    const handleCreate = () => {
        formik.resetForm({
            values: {
                state_id: 0,
                game_id: 0,
                draw_date: "",
                draw_time: "",
                winning_numbers: "",
                // COMMENTED OUT: Result Status flow
                // result: "",
                prize_amount: "",
            },
        });
        setSelectedHistory(null);
        setDialogOpen(true);
    };

    const handleEdit = (history: GameHistory) => {
        setSelectedHistory(history);
        formik.setValues({
            state_id: history.state_id,
            game_id: history.game_id,
            draw_date: history.draw_date,
            draw_time: history.draw_time,
            winning_numbers: history.winning_numbers,
            // COMMENTED OUT: Result Status flow
            // result: history.result,
            prize_amount: history.prize_amount,
        });
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedHistory) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteGameHistoryThunk(selectedHistory.id)).unwrap();
            toast.success("Game history deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedHistory(null);

            // Calculate if we need to go to previous page
            const currentItemsOnPage = gameHistories.length;
            const isLastItemOnPage = currentItemsOnPage === 1;
            const isNotFirstPage = pagination.page > 1;

            // If we deleted the last item on the current page and we're not on page 1, go to previous page
            const targetPage = isLastItemOnPage && isNotFirstPage
                ? pagination.page - 1
                : pagination.page;

            if (targetPage !== pagination.page) {
                dispatch(setPagination({ page: targetPage }));
            }

            // Refetch data to update pagination correctly
            await dispatch(
                getAllGameHistoriesThunk({
                    page: targetPage,
                    limit: pagination.limit,
                    filters,
                })
            );
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete game history");
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        dispatch(setPagination({ page }));
    };

    const handlePageSizeChange = (limit: number) => {
        dispatch(setPagination({ limit, page: 1 }));
    };

    const handleExportToExcel = async () => {
        try {
            // Fetch all filtered data (using a high limit to get all records)
            const exportFilters = {
                ...filters,
                search: searchTerm || undefined,
                // COMMENTED OUT: Result Status flow
                // result: resultFilter !== "all" ? (resultFilter as "WIN" | "LOSS" | "PENDING") : undefined,
                fromDate: startDate,
                toDate: endDate
            };

            await dispatch(
                getAllGameHistoriesThunk({
                    page: 1,
                    filters: exportFilters,
                })
            ).unwrap();

            // Prepare data for Excel
            const excelData = gameHistories.map((history) => ({
                "Draw Date": formatDateShort(history.draw_date),
                "Draw Time": getDrawTimeLabel(history.draw_time),
                "Game Type": history.game_name,
                "State": history.state_name,
                "Winning Numbers": history.winning_numbers,
                // COMMENTED OUT: Result Status flow
                // "Result": getResultLabel(history.result),
                "Prize Amount": history.prize_amount > 0 ? formatCurrency(history.prize_amount) : "N/A",
            }));

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Game History");

            // Set column widths for better readability
            const columnWidths = [
                { wch: 12 }, // Draw Date
                { wch: 12 }, // Draw Time
                { wch: 20 }, // Game Type
                { wch: 15 }, // State
                { wch: 18 }, // Winning Numbers
                { wch: 12 }, // Result
                { wch: 15 }, // Prize Amount
            ];
            worksheet["!cols"] = columnWidths;

            // Generate filename with current date
            const currentDate = new Date().toISOString().split("T")[0];
            const filename = `Game_History_${currentDate}.xlsx`;

            // Write file
            XLSX.writeFile(workbook, filename);

            toast.success(`Exported ${gameHistories.length} records successfully`);
        } catch (error: any) {
            toast.error(error?.message || "Failed to export data");
        }
    };


    // Fetch initial data
    useEffect(() => {
        dispatch(getAllStatesThunk());
        dispatch(getAllGameTypesThunk());
    }, [dispatch]);

    // Fetch game histories when filters or pagination change
    useEffect(() => {
        const searchFilters = {
            ...filters,
            search: searchTerm || undefined,
            // COMMENTED OUT: Result Status flow
            // result: resultFilter !== "all" ? (resultFilter as "WIN" | "LOSS" | "PENDING") : undefined,
            fromDate: startDate,
            toDate: endDate
        };

        dispatch(setFilters(searchFilters));
    }, [searchTerm, /* resultFilter, */ startDate, endDate, dispatch]);

    useEffect(() => {
        dispatch(
            getAllGameHistoriesThunk({
                page: pagination.page,
                limit: pagination.limit,
                filters,
            })
        );
    }, [pagination.page, pagination.limit, filters, dispatch]);

    const selectedState = states.find(
        (state: State) => state.id === formik.values.state_id
    );

    const selectedGameType = gameTypes.find(
        (gameType: GameType) => gameType.id === formik.values.game_id
    );


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Game History Management
                </h1>
                <p className="text-text-tertiary text-sm sm:text-base">
                    Manage game history data with full CRUD capabilities
                </p>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-col 2xl:flex-row gap-4 w-full">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
                        <Input
                            type="text"
                            placeholder="Search by state, winning number, or game type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            size="middle"
                        />
                    </div>
                </div>

                <div className="flex gap-2 w-full justify-end flex-wrap">
                    {/* COMMENTED OUT: Result Status flow */}
                    {/* <Select
                        value={resultFilter}
                        onValueChange={setResultFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue>
                                {RESULT_LABELS[resultFilter]}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Results</SelectItem>
                            <SelectItem value="WIN">Win</SelectItem>
                            <SelectItem value="LOSS">Loss</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                        </SelectContent>
                    </Select> */}
                    <div className="flex gap-2">
                        <DateTimePicker
                            rangePicker={true}
                            rangeValue={{
                                start: startDate,
                                end: endDate,
                            }}
                            onRangeChange={(range) => {
                                setStartDate(range.start);
                                setEndDate(range.end);
                            }}
                            placeholder="Filter by date"
                            className="w-full min-w-[220px]"
                            showDate={true}
                            showTime={false}
                        />
                    </div>

                    <Button
                        type="primary"
                        className="!w-fit "
                        icon={<Plus className="w-4 h-4" />}
                        onClick={handleCreate}
                    >
                        Create History
                    </Button>
                    <Button
                        type="button"
                        className="!w-fit disabled:opacity-50 disabled:cursor-not-allowed bg-bg-primary p"
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleExportToExcel}
                        disabled={gameHistories.length === 0}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-x-hidden overflow-y-visible">
                <div className="overflow-x-auto -mx-1 sm:mx-0 overflow-y-visible">
                    <div className="min-w-[1200px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Draw Date</TableHead>
                                    <TableHead className="min-w-[100px]">Draw Time</TableHead>
                                    <TableHead className="min-w-[150px]">Game Type</TableHead>
                                    <TableHead className="min-w-[120px]">State</TableHead>
                                    <TableHead className="min-w-[140px]">Winning Numbers</TableHead>
                                    {/* COMMENTED OUT: Result Status flow */}
                                    {/* <TableHead className="min-w-[100px]">Result</TableHead> */}
                                    <TableHead className="min-w-[120px]">Prize Amount</TableHead>
                                    <TableHead className="min-w-[120px]">
                                        <div className="flex items-center gap-1.5">
                                            Predicted
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-3.5 h-3.5 text-text-tertiary cursor-help hover:text-text-primary transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" className="max-w-[280px] text-xs leading-relaxed">
                                                        Indicates whether your prediction was correct.
                                                        <br />
                                                        <span className="font-semibold text-accent-primary">Yes</span> = Correct prediction
                                                        <br />
                                                        <span className="font-semibold text-text-tertiary">No</span> = Incorrect prediction
                                                    </TooltipContent>

                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableHead>

                                    <TableHead className="!text-center min-w-[140px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableSkeleton columns={8} />
                                ) : gameHistories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-text-tertiary">
                                            No game history found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    gameHistories.map((history) => {
                                        return (
                                            <TableRow key={history.id}>
                                                <TableCell className="text-text-primary">
                                                    {formatDateShort(history.draw_date)}
                                                </TableCell>
                                                <TableCell className="text-text-primary">
                                                    {history.draw_time}
                                                </TableCell>
                                                <TableCell className="text-text-primary">{history.game_name}</TableCell>
                                                <TableCell className="text-text-primary">{history.state_name}</TableCell>
                                                <TableCell>
                                                    <WinningNumbers
                                                        numbers={history.winning_numbers}
                                                        size="small"
                                                        numberClassName="bg-accent-primary text-black border-accent-primary"
                                                    />
                                                </TableCell>
                                                {/* COMMENTED OUT: Result Status flow */}
                                                {/* <TableCell>{getResultBadge(history.result)}</TableCell> */}
                                                <TableCell className="text-accent-primary font-medium">
                                                    {history.prize_amount > 0 ? (
                                                        <>{formatCurrency(history.prize_amount)}</>
                                                    ) : (
                                                        <span className="text-text-tertiary">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider w-fit
    ${history.is_predicted
                                                                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-500/20"
                                                                : "bg-bg-primary text-text-tertiary border border-text-tertiary"
                                                            }`}
                                                    >
                                                        {history.is_predicted ? "Yes" : "No"}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<Edit className="w-4 h-4" />}
                                                            onClick={() => handleEdit(history)}
                                                            className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                                                        />
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            danger
                                                            icon={<Trash2 className="w-4 h-4" />}
                                                            onClick={() => {
                                                                setSelectedHistory(history);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                            className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-border-primary bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm text-text-tertiary whitespace-nowrap">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                            {pagination.total} entries
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <Select
                                value={pagination.limit.toString()}
                                onValueChange={(value) => handlePageSizeChange(Number(value))}
                            >
                                <SelectTrigger className="w-full sm:w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["10", "20", "50", "100"].map((size) => (
                                        <SelectItem key={size} value={size}>
                                            {size} / page
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-text-primary" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={cn(
                                                    "px-2 sm:px-3 py-1 rounded text-sm transition-colors",
                                                    pagination.page === pageNum
                                                        ? "bg-accent-primary text-black font-semibold"
                                                        : "text-text-primary hover:bg-bg-tertiary"
                                                )}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Popup */}
            <Popup
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={selectedHistory ? "Edit Game History" : "Create Game History"}
                description={selectedHistory ? "Update the game history record details." : "Add a new game history record to the system."}
                footer={
                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
                        <Button
                            className="!w-full sm:!w-fit"
                            onClick={() => {
                                setDialogOpen(false);
                                formik.resetForm();
                                setSelectedHistory(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            className="!w-full sm:!w-fit"
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Saving..." : selectedHistory ? "Update History" : "Create History"}
                        </Button>
                    </div>
                }
            >
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                    {/* Draw Date */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Draw Date <span className="text-red-400">*</span>
                        </label>
                        <DateTimePicker
                            value={formik.values.draw_date ? new Date(formik.values.draw_date) : undefined}
                            onChange={(date) => {
                                if (date) {
                                    formik.setFieldValue("draw_date", date.toISOString());
                                }
                            }}
                            placeholder="Select draw date"
                            showDate={true}
                            showTime={false}
                        />
                        {formik.touched.draw_date && formik.errors.draw_date && (
                            <p className="text-xs text-red-400">{formik.errors.draw_date}</p>
                        )}
                    </div>

                    {/* State and Game Type */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                State <span className="text-red-400">*</span>
                            </label>
                            <Select
                                value={formik.values.state_id > 0 ? formik.values.state_id.toString() : ""}
                                onValueChange={(value) => formik.setFieldValue("state_id", Number(value))}
                            >
                                <SelectTrigger className="w-full">
                                    {selectedState ? selectedState.state_name : "Select state"}
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((state) => (
                                        <SelectItem key={state.id} value={state.id.toString()}>
                                            {state.state_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.state_id && formik.errors.state_id && (
                                <p className="text-xs text-red-400">{formik.errors.state_id}</p>
                            )}
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Game Type <span className="text-red-400">*</span>
                            </label>
                            <Select
                                value={formik.values.game_id > 0 ? formik.values.game_id.toString() : ""}
                                onValueChange={(value) => formik.setFieldValue("game_id", Number(value))}
                            >
                                <SelectTrigger className="w-full">
                                    {selectedGameType ? selectedGameType.game_name : "Select game type"}
                                </SelectTrigger>
                                <SelectContent>
                                    {gameTypes.map((gameType) => (
                                        <SelectItem key={gameType.id} value={gameType.id.toString()}>
                                            {gameType.game_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.game_id && formik.errors.game_id && (
                                <p className="text-xs text-red-400">{formik.errors.game_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Draw Time */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Draw Time <span className="text-red-400">*</span>
                            </label>
                            <Select
                                value={formik.values.draw_time || ""}
                                onValueChange={(value) => formik.setFieldValue("draw_time", value as "MID" | "EVE")}
                            >
                                <SelectTrigger className="w-full">
                                    {formik.values.draw_time ? getDrawTimeLabel(formik.values.draw_time) : "Select draw time"}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MID">MID</SelectItem>
                                    <SelectItem value="EVE">EVE</SelectItem>
                                </SelectContent>
                            </Select>
                            {formik.touched.draw_time && formik.errors.draw_time && (
                                <p className="text-xs text-red-400">{formik.errors.draw_time}</p>
                            )}
                        </div>

                        {/* COMMENTED OUT: Result Status flow */}
                        {/* <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Result Status <span className="text-red-400">*</span>
                            </label>
                            <Select
                                value={formik.values.result || ""}
                                onValueChange={(value) => {
                                    const resultValue = value as "WIN" | "LOSS" | "PENDING";
                                    formik.setFieldValue("result", resultValue);
                                    // Auto-set values when Loss or Pending is selected
                                    if (resultValue === "LOSS" || resultValue === "PENDING") {
                                        formik.setFieldValue("prize_amount", 0);
                                        formik.setFieldValue("winning_numbers", "000");
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {formik.values.result ? getResultLabel(formik.values.result) : "Select result status"}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WIN">Win</SelectItem>
                                    <SelectItem value="LOSS">Loss</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                            {formik.touched.result && formik.errors.result && (
                                <p className="text-xs text-red-400">{formik.errors.result}</p>
                            )}
                        </div> */}
                    </div>

                    {/* Winning Numbers */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Winning Numbers (0-9) <span className="text-red-400">*</span>
                        </label>
                        <Input
                            type="text"
                            value={formik.values.winning_numbers}
                            onChange={(e) => {
                                // COMMENTED OUT: Result Status flow - now always allow editing
                                // if (formik.values.result === "WIN") {
                                const value = e.target.value.replace(/\D/g, ""); // Only digits
                                formik.setFieldValue("winning_numbers", value);
                                // }
                            }}
                            placeholder="e.g., 123"
                        // COMMENTED OUT: Result Status flow
                        // disabled={formik.values.result === "LOSS" || formik.values.result === "PENDING"}
                        // className={formik.values.result === "LOSS" || formik.values.result === "PENDING" ? "opacity-60 cursor-not-allowed" : ""}
                        />
                        {formik.touched.winning_numbers && formik.errors.winning_numbers && (
                            <p className="text-xs text-red-400">{formik.errors.winning_numbers}</p>
                        )}
                        {/* COMMENTED OUT: Result Status flow */}
                        {/* {(formik.values.result === "LOSS" || formik.values.result === "PENDING") && (
                            <p className="text-xs text-text-tertiary">Automatically set to "000" for {formik.values.result === "LOSS" ? "Loss" : "Pending"} results</p>
                        )} */}
                    </div>

                    {/* Prize Amount */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Prize Amount ($)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formik.values.prize_amount === "" ? "" : String(formik.values.prize_amount)}
                            onChange={(e) => {
                                const value = e.target.value;
                                formik.setFieldValue("prize_amount", value === "" ? "" : (parseFloat(value) || 0));
                            }}
                            placeholder="Enter prize amount (optional)"
                        />
                        {formik.touched.prize_amount && formik.errors.prize_amount && (
                            <p className="text-xs text-red-400">{formik.errors.prize_amount}</p>
                        )}
                    </div>
                </form>
            </Popup>

            {/* Delete Popup */}
            <Popup
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Game History"
                description="Are you sure you want to delete this game history record? This action cannot be undone."
                footer={
                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
                        <Button
                            className="!w-full sm:!w-fit"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setSelectedHistory(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            danger
                            className="!w-full sm:!w-fit"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete History"}
                        </Button>
                    </div>
                }
            >
                <div className="py-3">
                    {selectedHistory && (
                        <div className="p-4 bg-bg-tertiary/50 rounded-lg">
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Draw Date:</strong> {formatDateShort(selectedHistory.draw_date)} at {getDrawTimeLabel(selectedHistory.draw_time)}
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Game Type:</strong> {selectedHistory.game_name}
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>State:</strong> {selectedHistory.state_name}
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Winning Numbers:</strong> {selectedHistory.winning_numbers}
                            </p>
                        </div>
                    )}
                </div>
            </Popup>
        </div>
    );
}
