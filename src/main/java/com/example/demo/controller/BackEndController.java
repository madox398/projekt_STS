package com.example.demo.controller;

import com.example.demo.model.KeyData;
import com.example.demo.repository.KeyRepository;
import com.sun.istack.NotNull;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@ComponentScan("com.example.demo.repository")
public class BackEndController {

    @Autowired
    private KeyRepository repo;

    @CrossOrigin
    @PostMapping("/keys/add")
    private JSONObject newKey(@RequestBody KeyData newKey) {
        if(newKey.getName().length()>0){

            repo.save(newKey);

            //Wyświetlanie id otrzymanego z bazy danych przesłanych danych w formacie JSON
            Map<String,Long> tempId = new HashMap<>();
            tempId.put("id",newKey.getId());
            return new JSONObject(tempId);
        }
        else {
            Map<String,String> tempError = new HashMap<>();
            tempError.put("error","name is null");
            return new JSONObject(tempError);
        }
    }


    //Wszystkie klucze z bazy
    @GetMapping(value = "/keys",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Iterable<KeyData> getKeys(HttpServletResponse response) {
        response.addHeader("Content-Type","application/json");
        return repo.findAll();
    }

    //Wszystkie klucze z bazy ale podzielone na strony
    @GetMapping(value = "/keys/{page}/{limit}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Page<KeyData> getPageOfKeys(HttpServletResponse response,
                                        @PathVariable @NotNull int page,
                                        @PathVariable @NotNull int limit) {
        response.addHeader("Content-Type","application/json");
        Pageable pageable = PageRequest.of(page,limit);
        return repo.queryAllBy(pageable);
    }


    //Wpis z podanym id
    @GetMapping(value = "/keys/id/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private KeyData getKeybyId(HttpServletResponse response, @PathVariable @NotNull Long id) {
        response.addHeader("Content-Type","application/json");
        return repo.findKeyDataById(id);
    }


    //Wypisanie wszystkich wpisów o podanym imieniu
    @GetMapping(value = "/keys/name/{name}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Iterable<KeyData> getKeybyName(HttpServletResponse response, @PathVariable @NotNull String name) {
        response.addHeader("Content-Type","application/json");
        return repo.findKeyDataByName(name);
    }

    //Wypisanie wszystkich wpisów o podanej nazwie i podzielonych na strony
    @GetMapping(value = "/keys/name/{name}/{page}/{limit}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Page<KeyData> getPageOfKeysbyName(HttpServletResponse response,
                                              @PathVariable @NotNull String name,
                                              @PathVariable @NotNull int page,
                                              @PathVariable @NotNull int limit) {
        response.addHeader("Content-Type","application/json");
        Pageable pageable = PageRequest.of(page,limit);
        return repo.findKeyDataByName(name,pageable);
    }
}