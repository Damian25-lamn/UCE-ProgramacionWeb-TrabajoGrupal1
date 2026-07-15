package com.programacion.web.modelo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    private Integer id;
    private Integer albumId;
    private String title;
    private String url;
    private String thumbnailUrl;

}
