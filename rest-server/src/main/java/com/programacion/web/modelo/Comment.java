package com.programacion.web.modelo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    private Integer id;
    private Integer postId;
    private String name;
    private String email;
    private String body;


}
