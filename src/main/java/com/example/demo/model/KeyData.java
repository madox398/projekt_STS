package com.example.demo.model;

import org.springframework.validation.annotation.Validated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "keymap")
@Validated
public class KeyData implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String keyCode;

    @Column(nullable = false)
    private int timePressed;

    @Column(nullable = false)
    private int timeToNextChar;

    public KeyData(){}

    public KeyData(String name, String keyCode, int timePressed, int timeToNext){
        this.name =name;
        this.keyCode = keyCode;
        this.timePressed = timePressed;
        this.timeToNextChar =timeToNext;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getKeyCode() {
        return keyCode;
    }

    public int getTimePressed() {
        return timePressed;
    }

    public int getTimeToNextChar() {
        return timeToNextChar;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setKeyCode(String charCode) {
        this.keyCode = charCode;
    }

    public void setTimePressed(int timePressed) {
        this.timePressed = timePressed;
    }

    public void setTimeToNextChar(int timeToNextChar) {
        this.timeToNextChar = timeToNextChar;
    }

    @Override
    public String toString() {
        return "KeyData{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", charCode=" + keyCode +
                ", timePress=" + timePressed +
                ", timeToNext=" + timeToNextChar +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KeyData keyData = (KeyData) o;
        return (keyCode.equals(keyData.keyCode)) &&
                (timePressed == keyData.timePressed) &&
                (timeToNextChar == keyData.timeToNextChar) &&
                Objects.equals(id, keyData.id) &&
                Objects.equals(name, keyData.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.name, this.keyCode, this.timePressed, this.timeToNextChar);
    }
}
