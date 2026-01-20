import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';
import { MemoryRouter } from 'react-router-dom';
import { productApi } from '../api/productApi';

// Mock useNavigate
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

// Mock useAuth
const useAuthMock = vi.fn();
const logoutMock = vi.fn();
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => useAuthMock(),
    };
});

// Mock productApi
vi.mock('../api/productApi', () => ({
    productApi: {
        getProducts: vi.fn(),
    },
}));

describe('DashboardPage Test', () => {
    const defaultUser = {
        username: 'TestUser',
        role: 'user',
    };

    beforeEach(() => {
        useAuthMock.mockReturnValue({
            user: defaultUser,
            logout: logoutMock,
        });
        navigateMock.mockClear();
        logoutMock.mockClear();
        vi.clearAllMocks();
    });

    describe('【前端元素】檢查儀表板基本元素', () => {
        it('Mock User 為一般用戶，檢查基本元素', async () => {
            (productApi.getProducts as any).mockResolvedValue([]); // Prevent loading hang

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('儀表板')).toBeInTheDocument();
                expect(screen.getByText(/Welcome, TestUser/)).toBeInTheDocument();
                expect(screen.getByText('一般用戶')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: '登出' })).toBeInTheDocument();
                expect(screen.queryByText('🛠️ 管理後台')).not.toBeInTheDocument();
            });
        });
    });

    describe('【前端元素】管理員權限顯示', () => {
        it('Mock User 為 Admin 用戶，檢查管理員元素', async () => {
            useAuthMock.mockReturnValue({
                user: { ...defaultUser, role: 'admin' },
                logout: logoutMock,
            });
            (productApi.getProducts as any).mockResolvedValue([]);

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('管理員')).toBeInTheDocument();
                expect(screen.getByText('🛠️ 管理後台')).toBeInTheDocument();
            });
        });
    });

    describe('【Mock API】商品載入中狀態', () => {
        it('Mock productApi.getProducts 處於 loading 狀態', async () => {
            // Return a promise that never resolves to simulate loading
            (productApi.getProducts as any).mockImplementation(() => new Promise(() => { }));

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            expect(screen.getByText('載入商品中...')).toBeInTheDocument();
        });
    });

    describe('【Mock API】商品載入成功 (顯示列表)', () => {
        it('Mock productApi.getProducts 回傳商品列表', async () => {
            const mockProducts = [
                { id: 1, name: 'Product A', price: 100, description: 'Desc A' },
                { id: 2, name: 'Product B', price: 200, description: 'Desc B' },
            ];
            (productApi.getProducts as any).mockResolvedValue(mockProducts);

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Product A')).toBeInTheDocument();
                expect(screen.getByText('Product B')).toBeInTheDocument();
                expect(screen.getByText('Desc A')).toBeInTheDocument();
                expect(screen.getByText('NT$ 100')).toBeInTheDocument();
            });
        });
    });

    describe('【Mock API】商品載入失敗', () => {
        it('Mock productApi.getProducts reject', async () => {
            (productApi.getProducts as any).mockRejectedValue({
                response: { data: { message: '無法載入商品資料' } }
            });

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('無法載入商品資料')).toBeInTheDocument();
            });
        });
    });

    describe('【Function 邏輯】登出功能', () => {
        it('點擊 "登出" 按鈕', async () => {
            (productApi.getProducts as any).mockResolvedValue([]);

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => expect(screen.queryByText('載入商品中...')).not.toBeInTheDocument());

            fireEvent.click(screen.getByRole('button', { name: '登出' }));

            expect(logoutMock).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true, state: null });
        });
    });
});
