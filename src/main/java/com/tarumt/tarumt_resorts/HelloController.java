package com.tarumt.tarumt_resorts;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 預留給 React 串接，允許跨域請求
public class HelloController {

    @GetMapping("/resorts")
    public List<String> getResorts() {
        // 回傳一個簡單的度假村清單 JSON 陣列
        return List.of("Genting Highlands Resort", "Langkawi Beach Resort", "Cameron Highlands Resort");
    }
}