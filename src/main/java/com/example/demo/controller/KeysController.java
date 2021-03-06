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
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@ComponentScan("com.example.demo.repository")
@RequestMapping(path="/keys")
public class KeysController {

    @Autowired
    private KeyRepository repo;

    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/add")
    private JSONObject newKey(@RequestBody KeyData newKey) {
            repo.save(newKey);

            //Wyświetlanie id otrzymanego z bazy danych przesłanych danych w formacie JSON
            Map<String,Long> tempId = new HashMap<>();
            tempId.put("id",newKey.getId());
            return new JSONObject(tempId);
    }

    //Wszystkie klucze z bazy
    @GetMapping(value = "/all",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Iterable<KeyData> getKeys(HttpServletResponse response) {
        response.addHeader("Content-Type","application/json");
        return repo.findAll();
    }

    //Wszystkie klucze z bazy ale podzielone na strony
    @GetMapping(value = "/all/{page}/{limit}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Page<KeyData> getPageOfKeys(HttpServletResponse response,
                                        @PathVariable @NotNull int page,
                                        @PathVariable @NotNull int limit) {
        response.addHeader("Content-Type","application/json");
        Pageable pageable = PageRequest.of(page,limit);
        return repo.queryAllBy(pageable);
    }


    //Wpis z podanym id
    @GetMapping(value = "/id/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private KeyData getKeybyId(HttpServletResponse response, @PathVariable @NotNull Long id) {
        response.addHeader("Content-Type","application/json");
        return repo.findKeyDataById(id);
    }


    //Wypisanie wszystkich wpisów o podanym imieniu
    @GetMapping(value = "/name/{name}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Iterable<KeyData> getKeybyName(HttpServletResponse response, @PathVariable @NotNull int name) {
        response.addHeader("Content-Type","application/json");
        return repo.findKeyDataByNameId(name);
    }

    //Wypisanie wszystkich wpisów o podanej nazwie i podzielonych na strony
    @GetMapping(value = "/name/{name}/{page}/{limit}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    private Page<KeyData> getPageOfKeysbyName(HttpServletResponse response,
                                              @PathVariable @NotNull int name,
                                              @PathVariable @NotNull int page,
                                              @PathVariable @NotNull int limit) {
        response.addHeader("Content-Type","application/json");
        Pageable pageable = PageRequest.of(page,limit);
        return repo.findKeyDataByNameId(name,pageable);
    }
    //Export to CSV
    @GetMapping("/export")
    public void exportToCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime + ".csv";
        response.setHeader(headerKey, headerValue);

        Iterable<KeyData> listUsers = repo.findAll();

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
        String[] csvHeader = {"name", "key_code", "time_pressed", "time_to_next_char"};
        String[] nameMapping = {"nameId", "keyCode", "timePressed", "timeToNextChar"};

        csvWriter.writeHeader(csvHeader);

        for (KeyData keyData : listUsers) {
            csvWriter.write(keyData, nameMapping);
        }
        csvWriter.close();
    }
}