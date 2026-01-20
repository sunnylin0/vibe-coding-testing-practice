
> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】檢查儀表板基本元素
**範例輸入**：
- Mock User 為一般用戶
- 渲染 `DashboardPage` 元件
**期待輸出**：
- 看到標題 "儀表板"
- 看到歡迎訊息 "Welcome, [Username] 👋"
- 看到角色徽章 "一般用戶"
- 看到 "登出" 按鈕
- **不應**看到 "管理後台" 連結

---

## [x] 【前端元素】管理員權限顯示
**範例輸入**：
- Mock User 為 Admin 用戶
- 渲染 `DashboardPage` 元件
**期待輸出**：
- 看到角色徽章 "管理員"
- 看到 "管理後台" 連結

---

## [x] 【Mock API】商品載入中狀態
**範例輸入**：
- Mock `productApi.getProducts` 處於 loading 狀態
- 渲染 `DashboardPage` 元件
**期待輸出**：
- 顯示 "載入商品中..." Loading Spinner

---

## [x] 【Mock API】商品載入成功 (顯示列表)
**範例輸入**：
- Mock `productApi.getProducts` 回傳商品列表 [Product A, Product B]
- 渲染 `DashboardPage` 元件
**期待輸出**：
- 顯示商品列表區塊
- 顯示 "Product A" 和 "Product B" 的資訊

---

## [x] 【Mock API】商品載入失敗
**範例輸入**：
- Mock `productApi.getProducts` reject (失敗)
- 渲染 `DashboardPage` 元件
**期待輸出**：
- 顯示錯誤訊息 (如 "無法載入商品資料")

---

## [x] 【Function 邏輯】登出功能
**範例輸入**：
- 點擊 "登出" 按鈕
**期待輸出**：
- 呼叫 `logout` 函式
- 導向至 "/login"
