package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
public class OtherController {

    @RequestMapping("/check.html")
    private String runPython() throws IOException {
        Runtime.getRuntime()
                .exec(
                        String.format("cmd.exe /c %s %s",
                                "C:\\Users\\pzamor\\IdeaProjects\\demo\\venv\\Scripts\\python.exe",
                                "C:\\Users\\pzamor\\IdeaProjects\\python_si\\forest.py"));
        return "check";
    }
}
