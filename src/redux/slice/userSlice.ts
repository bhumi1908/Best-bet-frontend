/**
 * User Slice
 * Manages user management state using Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllUsersThunk, getUserByIdThunk, updateUserThunk } from '../thunk/userThunk';
import {
    User,
    Pagination,
    UserFilters,
    UserState,
    ApiUserDetail,
} from '@/types/user';

// Initial state
const initialState: UserState = {
    users: [],
    selectedUser: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    filters: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
    },
    isLoading: false,
    error: null,
    lastUpdated: null,
};

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
        // Set filters
        setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
            // Reset to first page when filters change
            state.pagination.page = 1;
        },
        // Set pagination
        setPagination: (state, action: PayloadAction<Partial<Pagination>>) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload,
            };
        },
        // Reset filters
        resetFilters: (state) => {
            state.filters = {
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };
            state.pagination.page = 1;
        },
        // Update user in list (optimistic update)
        updateUserInList: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex((u) => u.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },

        addUserToList: (state, action: PayloadAction<User>) => {
            state.users.unshift(action.payload);
            state.pagination.total = (state.pagination.total || 0) + 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET ALL USERS
            .addCase(getAllUsersThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUsersThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(getAllUsersThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch users';
            })

            //GET USER BY ID
            .addCase(getUserByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserByIdThunk.fulfilled, (state, action: PayloadAction<ApiUserDetail>) => {
                state.isLoading = false;
                state.selectedUser = action.payload;
                state.error = null;
            })
            .addCase(getUserByIdThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch user";
            })

            // UPDATE USER
            .addCase(updateUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update user in the list
                const index = state.users.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUserThunk.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to update user';
            });
    },
});

// Export actions
export const { clearError, setFilters, setPagination, resetFilters, updateUserInList, addUserToList } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

    