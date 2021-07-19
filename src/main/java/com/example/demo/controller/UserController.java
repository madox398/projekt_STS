package com.example.demo.controller;

import com.example.demo.model.UserData;
import com.example.demo.repository.UserRepostitory;
import com.sun.istack.NotNull;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@ComponentScan("com.example.demo.repository")
@RequestMapping(path="/users")
public class UserController {

    @Autowired
    private UserRepostitory userRepo;


    //Wszyscy użytkownicy z bazy
    @GetMapping(value = "/all",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Iterable<UserData> getUsers(HttpServletResponse response) {
        response.addHeader("Content-Type","application/json");
        return userRepo.findAll();
    }

    //Wszyscy użytkownicy z bazy
    @GetMapping(value = "/id/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private UserData getById(HttpServletResponse response,
                             @PathVariable @NotNull int id) {
        response.addHeader("Content-Type","application/json");
        return userRepo.getAllById(id);
    }

    //Wszyscy użytkownicy z bazy
    @PostMapping(value = "/add",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private JSONObject newUser(@RequestBody UserData newuser,
                               HttpServletRequest request) {
        System.out.println("name:"+request.getParameter("name")+" id:"+request.getParameter("id"));
        if((request.getParameter("name") !=null) &&
                (request.getParameter("name").length()>0)){

            userRepo.save(newuser);

            //Wyświetlanie id otrzymanego z bazy danych przesłanych danych w formacie JSON
            Map<String,Integer> tempId = new HashMap<>();
            tempId.put("id",newuser.getId());
            return new JSONObject(tempId);
        }
        else {
            Map<String,String[]> tempError = new HashMap<>();
            String[] error = {"something is null",""};
            tempError.put("error",error);
            tempError.putAll(request.getParameterMap());
            return new JSONObject(tempError);
        }
    }

    //Wszyscy użytkownicy z bazy
    @GetMapping(value = "/name/{name}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private UserData getAllByName(HttpServletResponse response,
                                  @PathVariable @NotNull String name) {
        response.addHeader("Content-Type","application/json");
        return userRepo.getAllByName(name);
    }

    @PostMapping(value = "/add/name/{name}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private JSONObject newUserByName(HttpServletResponse response,
                                  @PathVariable @NotNull String name) {
        System.out.println("/name/add");
        System.out.println("name");
        response.addHeader("Content-Type","application/json");

        UserData userData = new UserData(name);
        userRepo.save(userData);
        Map<String,Integer> tempId = new HashMap<>();
        tempId.put("id",userData.getId());
        return new JSONObject(tempId);
    }
}
