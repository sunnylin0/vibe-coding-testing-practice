import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminPage } from './AdminPage';
import { MemoryRouter } from 'react-router-dom';

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

describe('AdminPage Test', () => {
    const defaultAdminUser = {
        username: 'AdminUser',
        role: 'admin',
    };

    beforeEach(() => {
        useAuthMock.mockReturnValue({
            user: defaultAdminUser,
            logout: logoutMock,
        });
        navigateMock.mockClear();
        logoutMock.mockClear();
        vi.clearAllMocks();
    });

    describe('【前端元素】檢查管理後台基本元素', () => {
        it('Mock User 為 Admin 用戶，檢查基本元素', () => {
            render(
                <MemoryRouter>
                    <AdminPage />
                </MemoryRouter>
            );

            expect(screen.getByText('🛠️ 管理後台')).toBeInTheDocument();
            expect(screen.getByText('← 返回')).toBeInTheDocument();
            expect(screen.getByText('管理員')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '登出' })).toBeInTheDocument();
            expect(screen.getByText('管理員專屬頁面')).toBeInTheDocument();
        });
    });

    describe('【Function 邏輯】返回儀表板', () => {
        it('點擊 "← 返回" 連結', () => {
            render(
                <MemoryRouter>
                    <AdminPage />
                </MemoryRouter>
            );

            const backLink = screen.getByText('← 返回');
            expect(backLink).toHaveAttribute('href', '/dashboard');
        });
    });

    describe('【Function 邏輯】登出功能', () => {
        it('點擊 "登出" 按鈕', () => {
            render(
                <MemoryRouter>
                    <AdminPage />
                </MemoryRouter>
            );

            fireEvent.click(screen.getByRole('button', { name: '登出' }));

            expect(logoutMock).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true, state: null });
        });
    });
});
