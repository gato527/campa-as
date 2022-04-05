-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-07-2020 a las 06:16:18
-- Versión del servidor: 10.1.21-MariaDB
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dowesoft_harinera`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a678`
--

CREATE TABLE `a678` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `ZZKATR2` varchar(125) DEFAULT NULL,
  `VKGRP` varchar(125) DEFAULT NULL,
  `MATKL` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `KRECH` varchar(125) DEFAULT NULL,
  `KONWA` varchar(125) DEFAULT NULL,
  `STFKZ` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a685`
--

CREATE TABLE `a685` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `ZZKUKLA` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `KRECH` varchar(125) DEFAULT NULL,
  `KONWA` varchar(125) DEFAULT NULL,
  `STFKZ` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a687`
--

CREATE TABLE `a687` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `VKBUR` varchar(125) DEFAULT NULL,
  `ZZKUKLA` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `precio` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a801`
--

CREATE TABLE `a801` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a823`
--

CREATE TABLE `a823` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a888`
--

CREATE TABLE `a888` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(9) DEFAULT NULL,
  `KAPPL` varchar(6) DEFAULT NULL,
  `KSCHL` varchar(12) DEFAULT NULL,
  `VKORG` varchar(12) DEFAULT NULL,
  `PRODH` varchar(54) DEFAULT NULL,
  `KONDM` varchar(6) DEFAULT NULL,
  `MATNR` varchar(54) DEFAULT NULL,
  `KFRST` varchar(3) DEFAULT NULL,
  `DATBI` varchar(24) DEFAULT NULL,
  `DATAB` varchar(24) DEFAULT NULL,
  `KBSTAT` varchar(6) DEFAULT NULL,
  `KNUMH` varchar(30) DEFAULT NULL,
  `KRECH` varchar(1) DEFAULT NULL,
  `KONWA` varchar(5) DEFAULT NULL,
  `STFKZ` varchar(1) DEFAULT NULL,
  `PRECIO` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a936`
--

CREATE TABLE `a936` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a967`
--

CREATE TABLE `a967` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `VKBUR` varchar(125) DEFAULT NULL,
  `KDGRP` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `precio` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a968`
--

CREATE TABLE `a968` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `VKBUR` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `precio` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a971`
--

CREATE TABLE `a971` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `KUNNR` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a972`
--

CREATE TABLE `a972` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `precio` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a974`
--

CREATE TABLE `a974` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `BZIRK` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a981`
--

CREATE TABLE `a981` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `KDGRP` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `precio` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a987`
--

CREATE TABLE `a987` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `VTWEG` varchar(125) DEFAULT NULL,
  `ZZKATR5` varchar(125) DEFAULT NULL,
  `PRODH` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `KRECH` varchar(125) DEFAULT NULL,
  `KONWA` varchar(125) DEFAULT NULL,
  `STFKZ` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `a997`
--

CREATE TABLE `a997` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `MANDT` varchar(125) DEFAULT NULL,
  `KAPPL` varchar(125) DEFAULT NULL,
  `KSCHL` varchar(125) DEFAULT NULL,
  `VKORG` varchar(125) DEFAULT NULL,
  `WERKS` varchar(125) DEFAULT NULL,
  `BZIRK` varchar(125) DEFAULT NULL,
  `KONDM` varchar(125) DEFAULT NULL,
  `MATNR` varchar(125) DEFAULT NULL,
  `KFRST` varchar(125) DEFAULT NULL,
  `DATBI` varchar(125) DEFAULT NULL,
  `DATAB` varchar(125) DEFAULT NULL,
  `KBSTAT` varchar(125) DEFAULT NULL,
  `KNUMH` varchar(125) DEFAULT NULL,
  `KRECH` varchar(125) DEFAULT NULL,
  `KONWA` varchar(125) DEFAULT NULL,
  `STFKZ` varchar(125) DEFAULT NULL,
  `PRECIO` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aclientes`
--

CREATE TABLE `aclientes` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `codigo` varchar(125) DEFAULT NULL,
  `nombre` varchar(125) DEFAULT NULL,
  `razonsocial` varchar(125) DEFAULT NULL,
  `nit` varchar(125) DEFAULT NULL,
  `direccion` varchar(125) DEFAULT NULL,
  `ciudad` varchar(125) DEFAULT NULL,
  `telefono` varchar(125) DEFAULT NULL,
  `vendedor` varchar(125) DEFAULT NULL,
  `fechaingreso` varchar(125) DEFAULT NULL,
  `ruta_parada` varchar(125) DEFAULT NULL,
  `canal` varchar(125) DEFAULT NULL,
  `subcanal` varchar(125) DEFAULT NULL,
  `cupo` varchar(125) DEFAULT NULL,
  `plazo` varchar(125) DEFAULT NULL,
  `ica` varchar(125) DEFAULT NULL,
  `actividad` varchar(125) DEFAULT NULL,
  `agencia` varchar(125) DEFAULT NULL,
  `tipodoc` varchar(125) DEFAULT NULL,
  `linea` varchar(125) DEFAULT NULL,
  `territorio` varchar(125) DEFAULT NULL,
  `tipocredito` varchar(125) DEFAULT NULL,
  `codpadre` varchar(125) DEFAULT NULL,
  `factor` varchar(125) DEFAULT NULL,
  `bloqueado` varchar(125) DEFAULT NULL,
  `sustituto` varchar(125) DEFAULT NULL,
  `retencion` varchar(125) DEFAULT NULL,
  `perica` varchar(125) DEFAULT NULL,
  `unidadmedida` varchar(125) DEFAULT NULL,
  `ordencompra` varchar(125) DEFAULT NULL,
  `cumpleanos` varchar(125) DEFAULT NULL,
  `codigoamarre` varchar(125) DEFAULT NULL,
  `clientecunit` varchar(125) DEFAULT NULL,
  `clientezenu` varchar(125) DEFAULT NULL,
  `clientesuizo` varchar(125) DEFAULT NULL,
  `tipocliente` varchar(125) DEFAULT NULL,
  `padrest` varchar(125) DEFAULT NULL,
  `codlista` varchar(125) DEFAULT NULL,
  `latitud` varchar(125) DEFAULT NULL,
  `longitud` varchar(125) DEFAULT NULL,
  `marcacliente` varchar(125) DEFAULT NULL,
  `cupoclte` varchar(125) DEFAULT NULL,
  `cupousado` varchar(125) DEFAULT NULL,
  `email` varchar(125) DEFAULT NULL,
  `clasecliente` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aproductos`
--

CREATE TABLE `aproductos` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Bodega` varchar(125) DEFAULT NULL,
  `Codigo` varchar(125) DEFAULT NULL,
  `Nombre` varchar(125) DEFAULT NULL,
  `Precio` varchar(125) DEFAULT NULL,
  `Saldo` varchar(125) DEFAULT NULL,
  `FechaNovedad` varchar(125) DEFAULT NULL,
  `Linea` varchar(125) DEFAULT NULL,
  `Grupo` varchar(125) DEFAULT NULL,
  `Unidadesxcaja` varchar(125) DEFAULT NULL,
  `Impulsar` varchar(125) DEFAULT NULL,
  `CantImp` varchar(125) DEFAULT NULL,
  `Bloqueado` varchar(125) DEFAULT NULL,
  `Iva` varchar(125) DEFAULT NULL,
  `Cambios` varchar(125) DEFAULT NULL,
  `UnidadMedida` varchar(125) DEFAULT NULL,
  `Agrupacion` varchar(125) DEFAULT NULL,
  `Vendedor` varchar(125) DEFAULT NULL,
  `Promocion` varchar(125) DEFAULT NULL,
  `UnidadVenta` varchar(125) DEFAULT NULL,
  `FactorLibras` varchar(125) DEFAULT NULL,
  `PrecioSugerido` varchar(125) DEFAULT NULL,
  `Impto1` varchar(125) DEFAULT NULL,
  `Impto2` varchar(125) DEFAULT NULL,
  `Peso` varchar(125) DEFAULT NULL,
  `pesobr` varchar(125) DEFAULT NULL,
  `Negocio` varchar(125) DEFAULT NULL,
  `Marca` varchar(125) DEFAULT NULL,
  `LineaProduccion` varchar(125) DEFAULT NULL,
  `Grupo2` varchar(125) DEFAULT NULL,
  `Tipo` varchar(125) DEFAULT NULL,
  `ITF` varchar(125) DEFAULT NULL,
  `EAN` varchar(125) DEFAULT NULL,
  `Tipocliente` varchar(125) DEFAULT NULL,
  `SPART` varchar(125) DEFAULT NULL,
  `categoria` varchar(125) DEFAULT NULL,
  `ida` varchar(125) DEFAULT NULL,
  `obr` varchar(125) DEFAULT NULL,
  `pes` varchar(125) DEFAULT NULL,
  `tamaño` varchar(125) DEFAULT NULL,
  `unidad_negocio` varchar(125) DEFAULT NULL,
  `web` varchar(125) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_descuentos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_descuentos` (
`id` int(11) unsigned
,`datab` varchar(120)
,`tabla` varchar(120)
,`columna` varchar(120)
,`kschl` varchar(120)
,`code` varchar(120)
,`name` varchar(120)
,`price` varchar(120)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_descuentos`
--
DROP TABLE IF EXISTS `vw_descuentos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_descuentos`  AS  (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP1') group by `listdescuentos`.`code`) union (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP6') group by `listdescuentos`.`code`) union (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP2') group by `listdescuentos`.`code`) union (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP3') group by `listdescuentos`.`code`) union (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP4') group by `listdescuentos`.`code`) union (select `listdescuentos`.`id` AS `id`,`listdescuentos`.`datab` AS `datab`,`listdescuentos`.`tabla` AS `tabla`,`listdescuentos`.`columna` AS `columna`,`listdescuentos`.`kschl` AS `kschl`,`listdescuentos`.`code` AS `code`,`listdescuentos`.`name` AS `name`,`listdescuentos`.`price` AS `price` from `listdescuentos` where (`listdescuentos`.`kschl` = 'ZTP5') group by `listdescuentos`.`code`) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `a678`
--
ALTER TABLE `a678`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a685`
--
ALTER TABLE `a685`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a687`
--
ALTER TABLE `a687`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a801`
--
ALTER TABLE `a801`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a823`
--
ALTER TABLE `a823`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a888`
--
ALTER TABLE `a888`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a936`
--
ALTER TABLE `a936`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a967`
--
ALTER TABLE `a967`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a968`
--
ALTER TABLE `a968`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a971`
--
ALTER TABLE `a971`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a972`
--
ALTER TABLE `a972`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a974`
--
ALTER TABLE `a974`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a981`
--
ALTER TABLE `a981`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a987`
--
ALTER TABLE `a987`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `a997`
--
ALTER TABLE `a997`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `aclientes`
--
ALTER TABLE `aclientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `aproductos`
--
ALTER TABLE `aproductos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `a678`
--
ALTER TABLE `a678`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1036;
--
-- AUTO_INCREMENT de la tabla `a685`
--
ALTER TABLE `a685`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `a687`
--
ALTER TABLE `a687`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT de la tabla `a801`
--
ALTER TABLE `a801`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `a823`
--
ALTER TABLE `a823`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `a888`
--
ALTER TABLE `a888`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `a936`
--
ALTER TABLE `a936`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `a967`
--
ALTER TABLE `a967`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT de la tabla `a968`
--
ALTER TABLE `a968`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1465;
--
-- AUTO_INCREMENT de la tabla `a971`
--
ALTER TABLE `a971`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;
--
-- AUTO_INCREMENT de la tabla `a972`
--
ALTER TABLE `a972`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=579;
--
-- AUTO_INCREMENT de la tabla `a974`
--
ALTER TABLE `a974`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `a981`
--
ALTER TABLE `a981`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- AUTO_INCREMENT de la tabla `a987`
--
ALTER TABLE `a987`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `a997`
--
ALTER TABLE `a997`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1054;
--
-- AUTO_INCREMENT de la tabla `aclientes`
--
ALTER TABLE `aclientes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49185;
--
-- AUTO_INCREMENT de la tabla `aproductos`
--
ALTER TABLE `aproductos`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=912;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
