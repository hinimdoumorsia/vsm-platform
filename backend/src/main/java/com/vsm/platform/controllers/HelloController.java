package com.vsm.platform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class HelloController {
    
    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "VSM Platform Backend fonctionne !");
        response.put("status", "OK");
        response.put("timestamp", new Date().toString());
        return response;
    }
    
    @GetMapping("/test")
    public String test() {
        return "Le backend est opérationnel !";
    }
}