=======================================================================
🚨 CRITICAL NOTICE: NO JAVA COLLECTIONS FRAMEWORK ALLOWED 🚨
=======================================================================
為了符合 BMCS2063 規格書規範，我們【絕對禁止】使用任何 Java 內建的集合框架 。
請所有隊友在提交代碼前，務必檢查並清除以下內容：

## ❌ 絕對【不能】出現的 Import 與類別：

- java.util.List / java.util.ArrayList
- java.util.LinkedList (不管是拿來當 List 還是 Queue)
- java.util.Queue / java.util.PriorityQueue
- java.util.Stack
- java.util.Vector
- java.util.Set / java.util.HashSet / java.util.TreeSet
- java.util.Map / java.util.HashMap / java.util.TreeMap
- java.util.Collections (尤其是 Collections.sort()，排序必須自己手寫！[cite: 13, 20])

=======================================================================
✅ 安全通行與替代方案（Safe & Allowed Alternatives）
=======================================================================

1. 資料容器（Data Containers）：
   只能使用我們小組自己手工刻寫（或者課程範例提供）的 ADT 介面與實作類別 [cite: 5, 37]。
   👉 正確範例：
   import com.tarumt.resort.adt.MyListInterface;
   import com.tarumt.resort.adt.MyLinkedList;

   MyListInterface<Customer> list = new MyLinkedList<>();

2. 基礎資料型態與陣列（Allowed Raw Types & Arrays）：
   - 傳統的 Java 陣列（例如：Customer[] 或 String[]）是完全合法的，可以用來作為 ADT 的底層實作。
   - 所有的基本型態（int, double, boolean 等）與 String。

3. 安全的 java.util.\* 工具（與集合無關，允許使用）：
   - java.util.Scanner (Console 輸入測試可用)
   - java.util.Date / java.util.Calendar (時間處理可用)
   - java.util.UUID / java.util.Random (隨機數與確認號生成可用)

4. 推薦的時間處理（更推薦使用 java.time.\* 包，100% 安全）：
   - java.time.LocalDateTime
   - java.time.LocalDate

請大家在寫 Control (Controller) 和 Entity 類別時嚴格遵守 ECB 架構 [cite: 41]，
雙手遠離 java.util 的集合類別，確保我們的 Academic Integrity 拿滿分！[cite: 15, 71]
=======================================================================
