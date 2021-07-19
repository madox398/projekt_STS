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

    @Column(name="name_id",nullable = false)
    private int nameId;

    @Column(name= "key_code", nullable = false)
    private String keyCode;

    @Column(name= "time_pressed", nullable = false)
    private int timePressed;

    @Column(name= "time_to_next_char", nullable = false)
    private int timeToNextChar;

    public KeyData(){}

    public KeyData(String keyCode, int timePressed, int timeToNext, int userData){
        this.nameId = userData;
        this.keyCode = keyCode;
        this.timePressed = timePressed;
        this.timeToNextChar =timeToNext;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNameId() {
        return nameId;
    }

    public void setNameId(int name) {
        this.nameId = name;
    }

    public String getKeyCode() {
        return keyCode;
    }

    public void setKeyCode(String keyCode) {
        this.keyCode = keyCode;
    }

    public int getTimePressed() {
        return timePressed;
    }

    public void setTimePressed(int timePressed) {
        this.timePressed = timePressed;
    }

    public int getTimeToNextChar() {
        return timeToNextChar;
    }

    public void setTimeToNextChar(int timeToNextChar) {
        this.timeToNextChar = timeToNextChar;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KeyData keyData = (KeyData) o;
        return nameId == keyData.nameId && timePressed == keyData.timePressed && timeToNextChar == keyData.timeToNextChar && Objects.equals(id, keyData.id) && keyCode.equals(keyData.keyCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nameId, keyCode, timePressed, timeToNextChar);
    }

    @Override
    public String toString() {
        return "KeyData{" +
                "id=" + id +
                ", name_id=" + nameId +
                ", keyCode='" + keyCode + '\'' +
                ", timePressed=" + timePressed +
                ", timeToNextChar=" + timeToNextChar +
                '}';
    }
}
