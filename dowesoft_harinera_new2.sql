-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-07-2020 a las 06:21:51
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
-- Estructura de tabla para la tabla `listdescuentos`
--

CREATE TABLE `listdescuentos` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tabla` varchar(120) DEFAULT NULL,
  `columna` varchar(120) DEFAULT NULL,
  `datab` varchar(120) DEFAULT NULL,
  `code` varchar(120) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `price` varchar(120) DEFAULT NULL,
  `kschl` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `listprice`
--

CREATE TABLE `listprice` (
  `id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(20) DEFAULT NULL,
  `code` varchar(120) DEFAULT NULL,
  `price` varchar(60) DEFAULT NULL,
  `tabla` varchar(120) DEFAULT NULL,
  `columna` varchar(120) DEFAULT NULL,
  `valor_columna` varchar(125) NOT NULL,
  `kschl` varchar(120) DEFAULT NULL,
  `datab` varchar(120) DEFAULT NULL,
  `iva` varchar(120) DEFAULT NULL,
  `campo1` varchar(120) DEFAULT NULL,
  `campo2` varchar(120) DEFAULT NULL,
  `campo3` varchar(120) DEFAULT NULL,
  `campo4` varchar(120) DEFAULT NULL,
  `campo5` varchar(120) DEFAULT NULL,
  `campo6` varchar(120) DEFAULT NULL,
  `datai` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `listdescuentos`
--
ALTER TABLE `listdescuentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `listprice`
--
ALTER TABLE `listprice`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `listdescuentos`
--
ALTER TABLE `listdescuentos`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2927;
--
-- AUTO_INCREMENT de la tabla `listprice`
--
ALTER TABLE `listprice`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
