package com.example.demo.repository;

import com.example.demo.model.UserData;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface UserRepostitory extends CrudRepository<UserData, Integer> {

    UserData getAllById(int id);

    UserData getAllByName(String name);
}
