package com.example.demo.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name= "user")
public class UserData implements Serializable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name= "id")
    private int id;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy="nameId",cascade = CascadeType.ALL)
    private Set<KeyData> userKeys;

    public UserData(String name){
        this.name=name;
    }

    public UserData() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserData userData = (UserData) o;
        return id == userData.id && name.equals(userData.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "UserData{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
