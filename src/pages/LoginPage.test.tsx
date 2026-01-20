import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';
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
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => useAuthMock(),
    };
});

describe('LoginPage Test', () => {
    const defaultAuthContext = {
        login: vi.fn(),
        isAuthenticated: false,
        authExpiredMessage: null,
        clearAuthExpiredMessage: vi.fn(),
        isLoading: false,
        user: null, // Add missing properties from AuthContextType
        token: null,
        logout: vi.fn(),
        checkAuth: vi.fn(),
    };

    beforeEach(() => {
        useAuthMock.mockReturnValue(defaultAuthContext);
        navigateMock.mockClear();
        vi.clearAllMocks();
    });

    describe('【前端元素】檢查登入頁面基本元素', () => {
        it('渲染 LoginPage 元件', () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );
            expect(screen.getByText('歡迎回來')).toBeInTheDocument();
            expect(screen.getByLabelText('電子郵件')).toHaveAttribute('type', 'text');
            expect(screen.getByLabelText('密碼')).toHaveAttribute('type', 'password');
            expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
        });
    });

    describe('【Logic/Validation】Email 格式驗證測試', () => {
        it('在 Email 欄位輸入 "invalid-email"，並提交表單', async () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'invalid-email' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            expect(screen.getByText('請輸入有效的 Email 格式')).toBeInTheDocument();
            expect(defaultAuthContext.login).not.toHaveBeenCalled();
        });
    });

    describe('【Logic/Validation】密碼長度驗證測試', () => {
        it('在密碼欄位輸入 "12345" (少於 8 碼)，並提交表單', async () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: '12345' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            expect(screen.getByText('密碼必須至少 8 個字元')).toBeInTheDocument();
            expect(defaultAuthContext.login).not.toHaveBeenCalled();
        });
    });

    describe('【Logic/Validation】密碼複雜度驗證測試 (純數字)', () => {
        it('在密碼欄位輸入 "12345678" (無英文字母)，並提交表單', async () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: '12345678' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            expect(screen.getByText('密碼必須包含英文字母和數字123124')).toBeInTheDocument();
            expect(defaultAuthContext.login).not.toHaveBeenCalled();
        });
    });

    describe('【Logic/Validation】密碼複雜度驗證測試 (純字母)', () => {
        it('在密碼欄位輸入 "abcdefgh" (無數字)，並提交表單', async () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: 'abcdefgh' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            expect(screen.getByText('密碼必須包含英文字母和數字')).toBeInTheDocument();
            expect(defaultAuthContext.login).not.toHaveBeenCalled();
        });
    });

    describe('【Mock API】登入成功流程測試', () => {
        it('輸入有效 Email 和 密碼，Mock login 函式 resolve', async () => {
            const loginMock = vi.fn().mockResolvedValue(undefined);
            useAuthMock.mockReturnValue({
                ...defaultAuthContext,
                login: loginMock,
            });

            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            await waitFor(() => {
                expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
            });

            // Check navigation directly
            expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
        });
    });

    describe('【Mock API】登入失敗流程測試', () => {
        it('輸入有效 Email 和 密碼，Mock login 函式 reject', async () => {
            const loginMock = vi.fn().mockRejectedValue({
                response: {
                    data: {
                        message: '帳號或密碼錯誤'
                    }
                }
            });
            useAuthMock.mockReturnValue({
                ...defaultAuthContext,
                login: loginMock,
            });

            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByLabelText('電子郵件'), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText('密碼'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByRole('button', { name: '登入' }));

            await waitFor(() => {
                expect(screen.getByText('帳號或密碼錯誤')).toBeInTheDocument();
            });
            expect(navigateMock).not.toHaveBeenCalled();
        });
    });

    describe('【驗證權限】已登入狀態導向測試', () => {
        it('Mock AuthContext 的 isAuthenticated 為 true', () => {
            useAuthMock.mockReturnValue({
                ...defaultAuthContext,
                isAuthenticated: true,
            });

            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
        });
    });

    describe('【驗證權限】Auth Token 過期訊息顯示', () => {
        it('Mock AuthContext 帶有 authExpiredMessage', () => {
            const clearAuthExpiredMessageMock = vi.fn();
            useAuthMock.mockReturnValue({
                ...defaultAuthContext,
                authExpiredMessage: '連線逾時，請重新登入',
                clearAuthExpiredMessage: clearAuthExpiredMessageMock,
            });

            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );

            expect(screen.getByText('連線逾時，請重新登入')).toBeInTheDocument();
            expect(clearAuthExpiredMessageMock).toHaveBeenCalled();
        });
    });

});
