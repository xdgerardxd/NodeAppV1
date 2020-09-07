CREATE DATABASE database_links;

DROP SCHEMA IF EXISTS `BD_COOPERATIVAS`;

USE database_links; 

/*Tabla de usuarios*/
CREATE TABLE users(
    id INT(11) NOT NULL, 
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

/*Tabla de enlaces*/
CREATE TABLE links(
    id INT(11) NOT NULL, 
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL, /*donde donde guardare el enlace que mostrare*/
    description TEXT,
    user_id INT(11),/*Campo para relacion con usuario*/ 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) /* convertir user_id en clave foranea y relacionarla con users id*/ 
);

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`COOPERATIVA` (
  `cd_coop` VARCHAR(8) NOT NULL COMMENT 'codigo generardo por sunacoop , con sus datos generarles',
  `cd_nacion` VARCHAR(1) NOT NULL,
  `nu_rif` INT NOT NULL,
  `nm_coop` VARCHAR(100) NOT NULL,
  `de_direccion` VARCHAR(200) NOT NULL,
  `tp_coop` INT NOT NULL,
  `tp_actividad` VARCHAR(3) NOT NULL,
  `fe_suscripcion` DATE NOT NULL,
  `st_status` VARCHAR(1) NOT NULL,
  `fe_status` DATE NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_coop`),
  INDEX `fk_COOPERATIVA_TIPOS_COOPERATIVA1_idx` (`tp_coop` ASC, `tp_actividad` ASC),
  CONSTRAINT `fk_COOPERATIVA_TIPOS_COOPERATIVA1`
    FOREIGN KEY (`tp_coop` , `tp_actividad`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA_TIPO` (`cd_tipo_coop` , `cd_actividad`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'Cooperativas registradas en sunacoop';

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`COOPERATIVA_ASOCIADA` (
  `cd_coop` VARCHAR(8) NOT NULL,
  `coop_asociada` VARCHAR(8) NOT NULL,
  `st_asociado` VARCHAR(1) NOT NULL,
  `fe_status` DATE NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_coop`, `coop_asociada`),
  INDEX `fk_cooperativa_asociada_cooperativa1_idx` (`cd_coop` ASC),
  INDEX `fk_coopas_coop_idx` (`coop_asociada` ASC),
  CONSTRAINT `fk_coop_coop`
    FOREIGN KEY (`cd_coop`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA` (`cd_coop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_coopas_coop`
    FOREIGN KEY (`coop_asociada`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA` (`cd_coop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'TABLA PARA ASOCIAR TODAS LAS COOPERATIVAS QUE ESTAN ASOCIADAS A UNA CENTRAL COOPERATIVA, Y SON LAS QUE MANIPULAR  VER LOS TRABAJADORES';

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`COOPERATIVA_TRAB` (
  `cd_coop` VARCHAR(8) NOT NULL,
  `id_trabajador` INT NOT NULL,
  `nm_nombre1` VARCHAR(45) NOT NULL,
  `nm_nombre2` VARCHAR(45) NULL DEFAULT NULL,
  `nm_apellido1` VARCHAR(45) NOT NULL,
  `nm_apellido2` VARCHAR(45) NULL DEFAULT NULL,
  `cd_nacion` VARCHAR(1) NOT NULL,
  `nu_cedula` INT NOT NULL,
  `st_trabajador` VARCHAR(1) NOT NULL,
  `fe_ingreso` DATE NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_coop`, `id_trabajador`),
  INDEX `fk_cooperativa_trab_cooperativa1_idx` (`cd_coop` ASC),
  CONSTRAINT `fk_coop_trab_cooperativa`
    FOREIGN KEY (`cd_coop`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA` (`cd_coop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'crear trabajadores de la coopperativa y poder crear su usuario';

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`COOPERATIVA_ASOCIADA_TRAB` (
  `cd_coop` VARCHAR(8) NOT NULL,
  `id_trabajador` INT NOT NULL,
  `coop_asociada` VARCHAR(8) NOT NULL,
  `st_asociada` VARCHAR(1) NOT NULL,
  `fe_status` DATE NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_coop`, `id_trabajador`, `coop_asociada`),
  INDEX `fk_COOPERATIVA_ASOCIADA_TRAB_COOPERATIVA_ASOCIADA1_idx` (`coop_asociada` ASC),
  CONSTRAINT `fk_COOPERATIVA_ASOCIADA_TRAB_COOPERATIVA_TRAB1`
    FOREIGN KEY (`cd_coop` , `id_trabajador`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA_TRAB` (`cd_coop` , `id_trabajador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_COOPERATIVA_ASOCIADA_TRAB_COOPERATIVA_ASOCIADA1`
    FOREIGN KEY (`coop_asociada`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA_ASOCIADA` (`coop_asociada`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'tabla para saber que cooperativas puede manipular un trabajador';

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`ROLE` (
  `cd_role` VARCHAR(2) NOT NULL,
  `de_descripcion` VARCHAR(45) NOT NULL,
  `st_rol` VARCHAR(1) NOT NULL,
  `fe_status` DATE NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_role`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `BD_COOPERATIVAS`.`USUARIO` (
  `cd_coop` VARCHAR(8) NOT NULL,
  `cd_usuario` VARCHAR(8) NOT NULL,
  `cd_password` VARCHAR(8) NOT NULL,
  `st_usuario` VARCHAR(1) NOT NULL,
  `fe_status` DATE NOT NULL,
  `cd_nacion` VARCHAR(1) NOT NULL,
  `nu_cedula` INT NOT NULL,
  `cd_role` VARCHAR(2) NOT NULL,
  `nm_pregunta_s1` VARCHAR(100) NOT NULL,
  `nm_pregunta_s2` VARCHAR(100) NOT NULL,
  `nm_repuesta_s1` VARCHAR(100) NOT NULL,
  `nm_repuesta_s2` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `fe_registro` DATE NOT NULL,
  PRIMARY KEY (`cd_coop`, `cd_usuario`),
  INDEX `fk_USUARIO_COOPERATIVA1_idx` (`cd_coop` ASC),
  INDEX `fk_USUARIO_CLIENTE1_idx` (`cd_nacion` ASC, `nu_cedula` ASC),
  INDEX `fk_USUARIO_ROLE1_idx` (`cd_role` ASC),
  CONSTRAINT `fk_USUARIO_CLIENTE1`
    FOREIGN KEY (`cd_nacion` , `nu_cedula`)
    REFERENCES `BD_COOPERATIVAS`.`CLIENTE` (`cd_nacion` , `nu_cedula`),
  CONSTRAINT `fk_USUARIO_COOPERATIVA1`
    FOREIGN KEY (`cd_coop`)
    REFERENCES `BD_COOPERATIVAS`.`COOPERATIVA` (`cd_coop`),
  CONSTRAINT `fk_USUARIO_ROLE1`
    FOREIGN KEY (`cd_role`)
    REFERENCES `BD_COOPERATIVAS`.`ROLE` (`cd_role`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = 'se puede registrar  un socio y solo puede ver su informacion , y se registran los trabajkdores de las cooperativas y solo van a poder ver la informacion de las cooperativas que tienen registradas en la tabla coopertiva asociada al trabajador';


/*Añadir mas adelante campos a la tabla */

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE links
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

DESCRIBE users;
DESCRIBE links;

/*Ver la estructura

mysql -u root -p
show databases; mostrar base de datos

*/

