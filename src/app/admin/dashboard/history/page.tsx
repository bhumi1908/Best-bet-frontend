"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Search,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Trophy,
    Clock,
    MapPin,
    RefreshCw,
    X,
    Check,
    AlertCircle,
    TrendingUp,
    Gamepad2,
    DollarSign,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Popup } from "@/components/ui/Popup";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

// Types
interface GameHistory {
    id: string;
    drawDate: string;
    drawTime: string;
    entryTime: string;
    selectedNumbers: [number, number, number];
    winningNumbers: [number, number, number];
    resultStatus: "win" | "loss" | "pending";
    prizeAmount: number;
    gameType: "pick3" | "pick4";
    gameStatus: "pending" | "completed" | "cancelled";
    state: string;
    userId?: string;
    userName?: string;
    createdAt: string;
    updatedAt: string;
}

type SortOrder = "ascend" | "descend" | null;
type SortColumn =
    | "drawDate"
    | "drawTime"
    | "resultStatus"
    | "prizeAmount"
    | "gameStatus"
    | "state"
    | null;

export default function HistoryPage() {
    // State
    const [loading, setLoading] = useState(true);
    const [histories, setHistories] = useState<GameHistory[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [resultFilter, setResultFilter] = useState<string>("all");
    const [stateFilter, setStateFilter] = useState<string>("all");
    const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
    const [sortedColumn, setSortedColumn] = useState<SortColumn>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<GameHistory | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        drawDate: "",
        drawTime: "",
        entryTime: "",
        selectedNumber1: "",
        selectedNumber2: "",
        selectedNumber3: "",
        winningNumber1: "",
        winningNumber2: "",
        winningNumber3: "",
        resultStatus: "pending" as "win" | "loss" | "pending",
        prizeAmount: "",
        gameType: "pick3" as "pick3" | "pick4",
        gameStatus: "completed" as "pending" | "completed" | "cancelled",
        state: "Florida",
        userId: "",
        userName: "",
    });

    // Date picker states
    const [drawDateTime, setDrawDateTime] = useState<Date | undefined>(undefined);
    const [entryDateTime, setEntryDateTime] = useState<Date | undefined>(undefined);

    // Stats
    const stats = useMemo(() => {
        const totalGames = histories.length;
        const wins = histories.filter((h) => h.resultStatus === "win").length;
        const losses = histories.filter((h) => h.resultStatus === "loss").length;
        const totalPrizeAmount = histories
            .filter((h) => h.resultStatus === "win")
            .reduce((sum, h) => sum + h.prizeAmount, 0);
        const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
        const pendingGames = histories.filter((h) => h.gameStatus === "pending").length;
        const completedGames = histories.filter((h) => h.gameStatus === "completed").length;

        return {
            totalGames,
            wins,
            losses,
            totalPrizeAmount,
            winRate,
            pendingGames,
            completedGames,
        };
    }, [histories]);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API calls
            // Simulated data for now
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock game history data
            const mockHistories: GameHistory[] = [
                {
                    id: "1",
                    drawDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [1, 2, 3],
                    winningNumbers: [1, 2, 3],
                    resultStatus: "win",
                    prizeAmount: 500,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_1",
                    userName: "John Doe",
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "2",
                    drawDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [4, 5, 6],
                    winningNumbers: [7, 8, 9],
                    resultStatus: "loss",
                    prizeAmount: 0,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_2",
                    userName: "Jane Smith",
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "3",
                    drawDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [2, 3, 4],
                    winningNumbers: [2, 3, 4],
                    resultStatus: "win",
                    prizeAmount: 250,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_3",
                    userName: "Bob Johnson",
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "4",
                    drawDate: new Date().toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [5, 6, 7],
                    winningNumbers: [0, 0, 0],
                    resultStatus: "pending",
                    prizeAmount: 0,
                    gameType: "pick3",
                    gameStatus: "pending",
                    state: "Florida",
                    userId: "user_4",
                    userName: "Alice Brown",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: "5",
                    drawDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [8, 9, 0],
                    winningNumbers: [1, 1, 1],
                    resultStatus: "loss",
                    prizeAmount: 0,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_5",
                    userName: "Charlie Davis",
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "6",
                    drawDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [3, 3, 3],
                    winningNumbers: [3, 3, 3],
                    resultStatus: "win",
                    prizeAmount: 1000,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_6",
                    userName: "David Wilson",
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "7",
                    drawDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [0, 1, 2],
                    winningNumbers: [9, 8, 7],
                    resultStatus: "loss",
                    prizeAmount: 0,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_7",
                    userName: "Eve Green",
                    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "8",
                    drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [6, 6, 6],
                    winningNumbers: [6, 6, 6],
                    resultStatus: "win",
                    prizeAmount: 750,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_8",
                    userName: "Frank Brown",
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "9",
                    drawDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [1, 1, 1],
                    winningNumbers: [1, 1, 1],
                    resultStatus: "win",
                    prizeAmount: 750,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_9",
                    userName: "George White",
                    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "10",
                    drawDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [2, 2, 2],
                    winningNumbers: [2, 2, 2],
                    resultStatus: "loss",
                    prizeAmount: 0,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_10",
                    userName: "Harry Black",
                    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: "11",
                    drawDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    drawTime: "14:00",
                    entryTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                    selectedNumbers: [3, 3, 3],
                    winningNumbers: [3, 3, 3],
                    resultStatus: "win",
                    prizeAmount: 750,
                    gameType: "pick3",
                    gameStatus: "completed",
                    state: "Florida",
                    userId: "user_11",
                    userName: "Ivy White",
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            setHistories(mockHistories);
        } catch (error: any) {
            console.error("Failed to fetch data:", error);
            toast.error(error?.message || "Failed to fetch game history data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filtered and sorted histories
    const filteredHistories = useMemo(() => {
        let filtered = histories;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (h) =>
                    h.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    h.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    h.selectedNumbers.join("").includes(searchTerm) ||
                    h.winningNumbers.join("").includes(searchTerm) ||
                    h.gameType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((h) => h.gameStatus === statusFilter);
        }

        // Result filter
        if (resultFilter !== "all") {
            filtered = filtered.filter((h) => h.resultStatus === resultFilter);
        }

        // State filter
        if (stateFilter !== "all") {
            filtered = filtered.filter((h) => h.state === stateFilter);
        }

        // Date range filter
        if (dateRangeFilter !== "all") {
            const now = new Date();
            let startDate: Date;
            switch (dateRangeFilter) {
                case "today":
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case "week":
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case "month":
                    startDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
                case "year":
                    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                    break;
                default:
                    startDate = new Date(0);
            }
            filtered = filtered.filter((h) => new Date(h.drawDate) >= startDate);
        }

        // Sorting
        if (sortedColumn && sortOrder) {
            filtered = [...filtered].sort((a, b) => {
                let aValue: any = a[sortedColumn as keyof GameHistory];
                let bValue: any = b[sortedColumn as keyof GameHistory];

                if (sortedColumn === "drawDate") {
                    aValue = new Date(a.drawDate).getTime();
                    bValue = new Date(b.drawDate).getTime();
                } else if (sortedColumn === "prizeAmount") {
                    aValue = a.prizeAmount;
                    bValue = b.prizeAmount;
                }

                if (typeof aValue === "string") {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (sortOrder === "ascend") {
                    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                } else {
                    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                }
            });
        }

        return filtered;
    }, [
        histories,
        searchTerm,
        statusFilter,
        resultFilter,
        stateFilter,
        dateRangeFilter,
        sortedColumn,
        sortOrder,
    ]);

    // Pagination
    const totalPages = Math.ceil(filteredHistories.length / pageSize);
    const paginatedHistories = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredHistories.slice(start, start + pageSize);
    }, [filteredHistories, currentPage, pageSize]);

    // Handlers
    const handleSort = (column: SortColumn) => {
        if (sortedColumn === column) {
            if (sortOrder === "ascend") {
                setSortOrder("descend");
            } else if (sortOrder === "descend") {
                setSortOrder(null);
                setSortedColumn(null);
            } else {
                setSortOrder("ascend");
            }
        } else {
            setSortedColumn(column);
            setSortOrder("ascend");
        }
        setCurrentPage(1);
    };

    const handleCreate = async () => {
        try {
            // Validate numbers
            const selectedNums = [
                parseInt(formData.selectedNumber1),
                parseInt(formData.selectedNumber2),
                parseInt(formData.selectedNumber3),
            ];
            const winningNums = [
                parseInt(formData.winningNumber1),
                parseInt(formData.winningNumber2),
                parseInt(formData.winningNumber3),
            ];

            if (selectedNums.some((n) => isNaN(n) || n < 0 || n > 9)) {
                toast.error("Selected numbers must be between 0 and 9");
                return;
            }
            if (winningNums.some((n) => isNaN(n) || n < 0 || n > 9)) {
                toast.error("Winning numbers must be between 0 and 9");
                return;
            }

            // Determine result status
            const isWin =
                selectedNums[0] === winningNums[0] &&
                selectedNums[1] === winningNums[1] &&
                selectedNums[2] === winningNums[2];

            const newHistory: GameHistory = {
                id: Date.now().toString(),
                drawDate: formData.drawDate,
                drawTime: formData.drawTime,
                entryTime: formData.entryTime || new Date().toISOString(),
                selectedNumbers: selectedNums as [number, number, number],
                winningNumbers: winningNums as [number, number, number],
                resultStatus: isWin ? "win" : "loss",
                prizeAmount: isWin ? parseFloat(formData.prizeAmount) || 0 : 0,
                gameType: formData.gameType,
                gameStatus: formData.gameStatus,
                state: formData.state,
                userId: formData.userId || undefined,
                userName: formData.userName || undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // TODO: Implement API call
            setHistories([newHistory, ...histories]);
            setCreateDialogOpen(false);
            resetForm();
            toast.success("Game history created successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to create game history");
        }
    };

    const handleEdit = async () => {
        if (!selectedHistory) return;

        try {
            // Validate numbers
            const selectedNums = [
                parseInt(formData.selectedNumber1),
                parseInt(formData.selectedNumber2),
                parseInt(formData.selectedNumber3),
            ];
            const winningNums = [
                parseInt(formData.winningNumber1),
                parseInt(formData.winningNumber2),
                parseInt(formData.winningNumber3),
            ];

            if (selectedNums.some((n) => isNaN(n) || n < 0 || n > 9)) {
                toast.error("Selected numbers must be between 0 and 9");
                return;
            }
            if (winningNums.some((n) => isNaN(n) || n < 0 || n > 9)) {
                toast.error("Winning numbers must be between 0 and 9");
                return;
            }

            // Determine result status
            const isWin =
                selectedNums[0] === winningNums[0] &&
                selectedNums[1] === winningNums[1] &&
                selectedNums[2] === winningNums[2];

            const updatedHistory: GameHistory = {
                ...selectedHistory,
                drawDate: formData.drawDate,
                drawTime: formData.drawTime,
                entryTime: formData.entryTime,
                selectedNumbers: selectedNums as [number, number, number],
                winningNumbers: winningNums as [number, number, number],
                resultStatus: isWin ? "win" : "loss",
                prizeAmount: isWin ? parseFloat(formData.prizeAmount) || 0 : 0,
                gameType: formData.gameType,
                gameStatus: formData.gameStatus,
                state: formData.state,
                userId: formData.userId || undefined,
                userName: formData.userName || undefined,
                updatedAt: new Date().toISOString(),
            };

            // TODO: Implement API call
            setHistories(
                histories.map((h) => (h.id === selectedHistory.id ? updatedHistory : h))
            );
            setEditDialogOpen(false);
            setSelectedHistory(null);
            resetForm();
            toast.success("Game history updated successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to update game history");
        }
    };

    const handleDelete = async () => {
        if (!selectedHistory) return;

        try {
            // TODO: Implement API call
            setHistories(histories.filter((h) => h.id !== selectedHistory.id));
            setDeleteDialogOpen(false);
            setSelectedHistory(null);
            toast.success("Game history deleted successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete game history");
        }
    };

    const resetForm = () => {
        setFormData({
            drawDate: "",
            drawTime: "",
            entryTime: "",
            selectedNumber1: "",
            selectedNumber2: "",
            selectedNumber3: "",
            winningNumber1: "",
            winningNumber2: "",
            winningNumber3: "",
            resultStatus: "loss",
            prizeAmount: "",
            gameType: "pick3",
            gameStatus: "completed",
            state: "Florida",
            userId: "",
            userName: "",
        });
    };

    const openEditDialog = (history: GameHistory) => {
        setSelectedHistory(history);
        setFormData({
            drawDate: history.drawDate,
            drawTime: history.drawTime,
            entryTime: history.entryTime,
            selectedNumber1: history.selectedNumbers[0].toString(),
            selectedNumber2: history.selectedNumbers[1].toString(),
            selectedNumber3: history.selectedNumbers[2].toString(),
            winningNumber1: history.winningNumbers[0].toString(),
            winningNumber2: history.winningNumbers[1].toString(),
            winningNumber3: history.winningNumbers[2].toString(),
            resultStatus: history.resultStatus,
            prizeAmount: history.prizeAmount.toString(),
            gameType: history.gameType,
            gameStatus: history.gameStatus,
            state: history.state,
            userId: history.userId || "",
            userName: history.userName || "",
        });
        setEditDialogOpen(true);
    };

    const openDeleteDialog = (history: GameHistory) => {
        setSelectedHistory(history);
        setDeleteDialogOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            completed: "bg-green-500/20 text-green-400 border-green-500/30",
            pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
        };
        return (
            <span
                className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    styles[status as keyof typeof styles] || styles.completed
                )}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getResultBadge = (result: string) => {
        return result === "win" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                Win
            </span>
        ) : result === "loss" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                Loss
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Pending
            </span>
        );
    };

    const renderNumbers = (numbers: [number, number, number], highlight = false) => {
        return (
            <div className="flex items-center gap-1">
                {numbers.map((num, idx) => (
                    <span
                        key={idx}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2",
                            highlight
                                ? "bg-accent-primary text-black border-accent-primary"
                                : "bg-bg-tertiary text-text-primary border-border-primary"
                        )}
                    >
                        {num}
                    </span>
                ))}
            </div>
        );
    };

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
                            placeholder="Search by user, state, or numbers..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 "
                            size="middle"
                        />
                    </div>
                </div>

                <div className="flex gap-2 w-full justify-end">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Game Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={resultFilter}
                        onValueChange={(value) => {
                            setResultFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Result" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Results</SelectItem>
                            <SelectItem value="win">Win</SelectItem>
                            <SelectItem value="loss">Loss</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={dateRangeFilter}
                        onValueChange={(value) => {
                            setDateRangeFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        type="primary"
                        className="!w-fit"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => {
                            resetForm();
                            setCreateDialogOpen(true);
                        }}
                    >
                        Create History
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className=" rounded-lg overflow-hidden">
                <div className="overflow-x-auto -mx-1 sm:mx-0">
                    <div className="min-w-[1200px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Draw Date</TableHead>
                                    <TableHead className="min-w-[100px]">Draw Time</TableHead>
                                    <TableHead className="min-w-[150px]">Game Type</TableHead>
                                    <TableHead className="min-w-[150px]">User</TableHead>
                                    <TableHead className="min-w-[120px]">State</TableHead>
                                    <TableHead className="min-w-[140px]">Selected Numbers</TableHead>
                                    <TableHead className="min-w-[140px]">Winning Numbers</TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                                        onClick={() => handleSort("resultStatus")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Result</span>
                                            {sortedColumn === "resultStatus" && (
                                                <span className="flex flex-col">
                                                    <ChevronUp
                                                        className={cn(
                                                            "w-3 h-3",
                                                            sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-3 h-3 -mt-1",
                                                            sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[120px]"
                                        onClick={() => handleSort("prizeAmount")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Prize</span>
                                            {sortedColumn === "prizeAmount" && (
                                                <span className="flex flex-col">
                                                    <ChevronUp
                                                        className={cn(
                                                            "w-3 h-3",
                                                            sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-3 h-3 -mt-1",
                                                            sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none hover:bg-bg-tertiary min-w-[100px]"
                                        onClick={() => handleSort("gameStatus")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Status</span>
                                            {sortedColumn === "gameStatus" && (
                                                <span className="flex flex-col">
                                                    <ChevronUp
                                                        className={cn(
                                                            "w-3 h-3",
                                                            sortOrder === "ascend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-3 h-3 -mt-1",
                                                            sortOrder === "descend" ? "text-accent-primary" : "text-text-muted"
                                                        )}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="!text-center min-w-[140px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton columns={11} />
                                ) : paginatedHistories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-8 text-text-tertiary">
                                            No game history found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedHistories.map((history) => (
                                        <TableRow key={history.id}>
                                            <TableCell className="text-text-primary">
                                                {new Date(history.drawDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className="text-text-primary">{history.drawTime}</TableCell>
                                            <TableCell className="text-text-primary">{history.gameType}</TableCell>
                                            <TableCell className="text-text-primary">
                                                {history.userName || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-text-primary">
                                                <div className="flex items-center gap-1">
                                                    {history.state}
                                                </div>
                                            </TableCell>
                                            <TableCell>{renderNumbers(history.selectedNumbers)}</TableCell>
                                            <TableCell>
                                                {renderNumbers(
                                                    history.winningNumbers,
                                                    history.gameStatus === "completed"
                                                )}
                                            </TableCell>
                                            <TableCell>{getResultBadge(history.resultStatus)}</TableCell>
                                            <TableCell className="text-accent-primary font-medium">
                                                {history.resultStatus === "win" ? (
                                                    <>${history.prizeAmount.toLocaleString()}</>
                                                ) : (
                                                    <span className="text-text-tertiary">$0</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(history.gameStatus)}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<Edit className="w-4 h-4" />}
                                                        onClick={() => openEditDialog(history)}
                                                        className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                                                    />
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        danger
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        onClick={() => openDeleteDialog(history)}
                                                        className="!p-1 !h-auto !w-fit hover:bg-bg-tertiary transition-colors"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-border-primary bg-bg-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm text-text-tertiary whitespace-nowrap">
                            Showing {(currentPage - 1) * pageSize + 1} to{" "}
                            {Math.min(currentPage * pageSize, filteredHistories.length)} of{" "}
                            {filteredHistories.length} entries
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <Select
                                value={pageSize.toString()}
                                onValueChange={(value) => {
                                    setPageSize(Number(value));
                                    setCurrentPage(1);
                                }}
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
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-text-primary" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={cn(
                                                    "px-2 sm:px-3 py-1 rounded text-sm transition-colors",
                                                    currentPage === pageNum
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
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Popup */}
            <Popup
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                title="Create Game History"
                description="Add a new game history record to the system."
                footer={
                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
                        <Button
                            className="!w-full sm:!w-fit"
                            onClick={() => setCreateDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            className="!w-full sm:!w-fit"
                            onClick={handleCreate}
                        >
                            Create History
                        </Button>
                    </div>
                }
            >
                <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
                    {/* Draw Date & Time and Entry Time */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Draw Date & Time
                            </label>
                            <div className="relative">
                                <DateTimePicker
                                    value={drawDateTime}
                                    onChange={(date) => {
                                        setDrawDateTime(date);
                                        if (date) {
                                            setFormData({
                                                ...formData,
                                                drawDate: date.toISOString().split('T')[0],
                                                drawTime: date.toTimeString().split(' ')[0].substring(0, 5)
                                            });
                                        }
                                    }}
                                    placeholder="Select draw date and time"
                                    showDate={true}
                                    showTime={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Entry Time
                            </label>
                            <div className="relative">
                                <DateTimePicker
                                    value={entryDateTime}
                                    onChange={(date) => {
                                        setEntryDateTime(date);
                                        if (date) {
                                            setFormData({
                                                ...formData,
                                                entryTime: date.toISOString().slice(0, 16)
                                            });
                                        }
                                    }}
                                    placeholder="Select entry date and time"
                                    showDate={true}
                                    showTime={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* State and Game Type */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                State
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.state}
                                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Florida">Florida</SelectItem>
                                        <SelectItem value="Missouri">Missouri</SelectItem>
                                        <SelectItem value="Texas">Texas</SelectItem>
                                        <SelectItem value="California">California</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Game Type
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.gameType}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, gameType: value as "pick3" | "pick4" })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pick3">Pick 3</SelectItem>
                                        <SelectItem value="pick4">Pick 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Selected Numbers */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Selected Numbers (0-9)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber1}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber1: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber2}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber2: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber3}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber3: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Winning Numbers */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Winning Numbers (0-9)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber1}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber1: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber2}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber2: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber3}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber3: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Game Status and Prize Amount */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Game Status
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.gameStatus}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            gameStatus: value as "pending" | "completed" | "cancelled",
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Prize Amount ($)
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.prizeAmount}
                                    onChange={(e) => setFormData({ ...formData, prizeAmount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User ID and User Name */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                User ID (Optional)
                            </label>
                            <div className="relative">
                                <Input
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    placeholder="user_123"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                User Name (Optional)
                            </label>
                            <div className="relative">
                                <Input
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Popup>

            {/* Edit Popup */}
            <Popup
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title="Edit Game History"
                description="Update the game history record details."
                footer={
                    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 w-full">
                        <Button
                            className="!w-full sm:!w-fit"
                            onClick={() => setEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            className="!w-full sm:!w-fit"
                            onClick={handleEdit}
                        >
                            Update History
                        </Button>
                    </div>
                }
            >
                <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
                    {/* Draw Date & Time and Entry Time */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Draw Date & Time
                            </label>
                            <div className="relative">
                                <DateTimePicker
                                    value={drawDateTime}
                                    onChange={(date) => {
                                        setDrawDateTime(date);
                                        if (date) {
                                            setFormData({
                                                ...formData,
                                                drawDate: date.toISOString().split('T')[0],
                                                drawTime: date.toTimeString().split(' ')[0].substring(0, 5)
                                            });
                                        }
                                    }}
                                    placeholder="Select draw date and time"
                                    showDate={true}
                                    showTime={true}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Entry Time
                            </label>
                            <div className="relative">
                                <DateTimePicker
                                    value={entryDateTime}
                                    onChange={(date) => {
                                        setEntryDateTime(date);
                                        if (date) {
                                            setFormData({
                                                ...formData,
                                                entryTime: date.toISOString().slice(0, 16)
                                            });
                                        }
                                    }}
                                    placeholder="Select entry date and time"
                                    showDate={true}
                                    showTime={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* State and Game Type */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                State
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.state}
                                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Florida">Florida</SelectItem>
                                        <SelectItem value="Missouri">Missouri</SelectItem>
                                        <SelectItem value="Texas">Texas</SelectItem>
                                        <SelectItem value="California">California</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Game Type
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.gameType}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, gameType: value as "pick3" | "pick4" })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pick3">Pick 3</SelectItem>
                                        <SelectItem value="pick4">Pick 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Selected Numbers */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Selected Numbers (0-9)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber1}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber1: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber2}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber2: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.selectedNumber3}
                                onChange={(e) =>
                                    setFormData({ ...formData, selectedNumber3: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Winning Numbers */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-300">
                            Winning Numbers (0-9)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber1}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber1: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber2}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber2: e.target.value })
                                }
                                placeholder="0"
                            />
                            <Input
                                type="number"
                                min="0"
                                max="9"
                                value={formData.winningNumber3}
                                onChange={(e) =>
                                    setFormData({ ...formData, winningNumber3: e.target.value })
                                }
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Game Status and Prize Amount */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Game Status
                            </label>
                            <div className="relative">
                                <Select
                                    value={formData.gameStatus}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            gameStatus: value as "pending" | "completed" | "cancelled",
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                Prize Amount ($)
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.prizeAmount}
                                    onChange={(e) => setFormData({ ...formData, prizeAmount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User ID and User Name */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                User ID (Optional)
                            </label>
                            <div className="relative">
                                <Input
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    placeholder="user_123"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <label className="block text-sm font-medium text-gray-300">
                                User Name (Optional)
                            </label>
                            <div className="relative">
                                <Input
                                    value={formData.userName}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
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
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            danger
                            className="!w-full sm:!w-fit"
                            onClick={handleDelete}
                        >
                            Delete History
                        </Button>
                    </div>
                }
            >
                <div className="py-3">
                    {selectedHistory && (
                        <div className="p-4 bg-bg-tertiary/50 rounded-lg">
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Draw Date:</strong>{" "}
                                {new Date(selectedHistory.drawDate).toLocaleDateString()} at {selectedHistory.drawTime}
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Game type:</strong> {selectedHistory.gameType}
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Selected Numbers:</strong> {selectedHistory.selectedNumbers.join(" - ")} 
                            </p>
                            <p className="text-sm text-text-primary mb-2">
                                <strong>Winning Numbers:</strong> {selectedHistory.winningNumbers.join(" - ")}
                            </p>
                        </div>
                    )}
                </div>
            </Popup>
        </div>
    );
}

