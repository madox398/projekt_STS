package com.example.demo.service;

import com.example.demo.model.KeyData;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class KeysService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public List<KeyData> findKeyDataByNameId(int name_id){
        System.out.println(name_id);
        List<KeyData> result = em.createQuery("SELECT id,keyCode,timePressed,timeToNextChar,nameId from KeyData WHERE nameId= :name_id", KeyData.class).setParameter("name_id", name_id).getResultList();
        System.out.println(result);
        return result;
    }
}