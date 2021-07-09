package com.example.demo.repository;

import com.example.demo.model.KeyData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface KeyRepository extends CrudRepository<KeyData, Long> {

    KeyData findKeyDataById(Long Id);

    Iterable<KeyData> findKeyDataByName(String name);

    Page<KeyData> findKeyDataByName(String name,Pageable pageable);

    @Query("SELECT * FROM keymap")
    Page<KeyData> queryAllBy(Pageable pageable);
}