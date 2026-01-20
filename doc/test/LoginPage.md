
> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】檢查登入頁面基本元素
**範例輸入**：渲染 `LoginPage` 元件
**期待輸出**：
- 看到標題 "歡迎回來"
- 看到 Email 輸入框 (type="text")
- 看到 密碼 輸入框 (type="password")
- 看到 登入按鈕

---

## [x] 【Logic/Validation】Email 格式驗證測試
**範例輸入**：在 Email 欄位輸入 "invalid-email"，並提交表單
**期待輸出**：
- 顯示錯誤訊息 "請輸入有效的 Email 格式"
- 不會觸發登入 API

---

## [x] 【Logic/Validation】密碼長度驗證測試
**範例輸入**：在密碼欄位輸入 "12345" (少於 8 碼)，並提交表單
**期待輸出**：
- 顯示錯誤訊息 "密碼必須至少 8 個字元"
- 不會觸發登入 API

---

## [x] 【Logic/Validation】密碼複雜度驗證測試 (純數字)
**範例輸入**：在密碼欄位輸入 "12345678" (無英文字母)，並提交表單
**期待輸出**：
- 顯示錯誤訊息 "密碼必須包含英文字母和數字"
- 不會觸發登入 API

---

## [x] 【Logic/Validation】密碼複雜度驗證測試 (純字母)
**範例輸入**：在密碼欄位輸入 "abcdefgh" (無數字)，並提交表單
**期待輸出**：
- 顯示錯誤訊息 "密碼必須包含英文字母和數字"
- 不會觸發登入 API

---

## [x] 【Mock API】登入成功流程測試
**範例輸入**：
- 輸入有效 Email "test@example.com"
- 輸入有效密碼 "password123"
- Mock `login` 函式 resolve (成功)
- 點擊登入按鈕
**期待輸出**：
- 呼叫 `login` 函式帶入正確參數
- 登入按鈕顯示 "登入中..." (isLoading 狀態)
- 成功後導向至 "/dashboard"

---

## [x] 【Mock API】登入失敗流程測試
**範例輸入**：
- 輸入有效 Email 和 密碼
- Mock `login` 函式 reject (失敗，回傳錯誤訊息 "帳號或密碼錯誤")
- 點擊登入按鈕
**期待輸出**：
- 頁面顯示錯誤 Banner "帳號或密碼錯誤"
- Loading 狀態結束，按鈕恢復 "登入"

---

## [x] 【驗證權限】已登入狀態導向測試
**範例輸入**：
- Mock `AuthContext` 的 `isAuthenticated` 為 true
- 渲染 `LoginPage` 元件
**期待輸出**：
- 自動導向至 "/dashboard"

---

## [x] 【驗證權限】Auth Token 過期訊息顯示
**範例輸入**：
- Mock `AuthContext` 帶有 `authExpiredMessage` = "連線逾時，請重新登入"
- 渲染 `LoginPage` 元件
**期待輸出**：
- 頁面顯示錯誤 Banner "連線逾時，請重新登入"
- 呼叫 `clearAuthExpiredMessage`
