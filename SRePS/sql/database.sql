-- phpMyAdmin SQL Dump
-- version 3.5.4
-- http://www.phpmyadmin.net
--
-- Host: mysql.ict.swin.edu.au:3306
-- Generation Time: Aug 30, 2016 at 05:25 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `s100669579_db`
--
CREATE DATABASE `s100669579_db` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `s100669579_db`;

-- --------------------------------------------------------

--
-- Table structure for table `Batch`
--

CREATE TABLE IF NOT EXISTS `Batch` (
  `Batch_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `ExpiryDate` date NOT NULL,
  `Shelf` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Batch_ID`),
  KEY `Product_ID` (`Product_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `Batch`
--

INSERT INTO `Batch` (`Batch_ID`, `Product_ID`, `Quantity`, `ExpiryDate`, `Shelf`) VALUES
(1, 9, 20, '2021-06-21', 'S3'),
(2, 5, 5, '2017-09-01', 'Q2'),
(3, 1, 21, '2016-11-06', 'F6'),
(4, 4, 21, '2017-06-28', 'A1'),
(5, 9, 7, '2017-12-28', 'S5'),
(6, 7, 20, '2019-03-20', 'C5'),
(7, 4, 9, '2017-10-24', 'N2'),
(8, 6, 17, '2020-04-23', 'C5'),
(9, 3, 10, '2017-04-09', 'G6'),
(10, 7, 22, '2021-07-04', 'I1');

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE IF NOT EXISTS `Category` (
  `Category_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(50) NOT NULL,
  PRIMARY KEY (`Category_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE IF NOT EXISTS `Product` (
  `Product_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(40) NOT NULL,
  `ReorderLevel` int(11) NOT NULL,
  `Supplier` varchar(15) NOT NULL,
  `UnitPrice` decimal(15,2) NOT NULL,
  `Category_ID` int(11) NOT NULL,
  PRIMARY KEY (`Product_ID`),
  KEY `Category_ID` (`Category_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`Product_ID`, `Description`, `ReorderLevel`, `Supplier`, `UnitPrice`, `Category_ID`) VALUES
(1, 'Cymbalta', 24, 'Consectetuer In', '182.00', 7),
(2, 'Doxycycline', 16, 'Consectetuer Eu', '174.00', 7),
(3, 'Metoprolol', 22, 'Enim Gravida As', '187.00', 5),
(4, 'Xanax', 25, 'Suspendisse Tri', '179.00', 8),
(5, 'Pantoprazole', 22, 'Varius Orci In ', '51.00', 6),
(6, 'Citalopram', 18, 'Lectus Quis Mas', '156.00', 8),
(7, 'Alprazolam', 23, 'Orci Ut Sagitti', '102.00', 8),
(8, 'Azithromycin', 24, 'Ipsum Primis In', '81.00', 1),
(9, 'Ciprofloxacin', 25, 'Velit Sed Males', '100.00', 5),
(10, 'Trazodone', 17, 'Sed Pede Cum Co', '165.00', 4);

-- --------------------------------------------------------

--
-- Table structure for table `Sales`
--

CREATE TABLE IF NOT EXISTS `Sales` (
  `Sale_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SaleDate` date NOT NULL,
  `Amount` double NOT NULL,
  `Paid` double NOT NULL,
  `Change` double NOT NULL,
  `Staff_ID` int(11) NOT NULL,
  PRIMARY KEY (`Sale_ID`),
  KEY `Staff_ID` (`Staff_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `Sales`
--

INSERT INTO `Sales` (`Sale_ID`, `SaleDate`, `Amount`, `Paid`, `Change`, `Staff_ID`) VALUES
(10, '2017-02-15', 65, 90, 164, 5),
(9, '2016-06-04', 62, 96, 154, 1),
(8, '2016-03-08', 50, 119, 149, 6),
(7, '2016-05-13', 58, 32, 158, 1),
(6, '2017-04-20', 54, 69, 126, 2),
(5, '2016-10-16', 65, 73, 124, 1),
(4, '2015-11-04', 65, 95, 168, 8),
(3, '2016-02-20', 71, 59, 157, 2),
(2, '2016-01-26', 53, 48, 122, 6),
(1, '2017-07-06', 75, 85, 144, 1),
(14, '2016-02-12', 135, 150, 50, 5);

-- --------------------------------------------------------

--
-- Table structure for table `SalesItem`
--

CREATE TABLE IF NOT EXISTS `SalesItem` (
  `Sale_ID` int(11) NOT NULL,
  `Batch_ID` int(11) NOT NULL,
  `QuantitySold` int(11) NOT NULL,
  PRIMARY KEY (`Sale_ID`,`Batch_ID`),
  KEY `Batch_ID` (`Batch_ID`),
  KEY `Sale_ID` (`Sale_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `SalesItem`
--

INSERT INTO `SalesItem` (`Sale_ID`, `Batch_ID`, `QuantitySold`) VALUES
(3, 7, 13),
(7, 2, 22),
(8, 4, 22),
(10, 4, 20),
(4, 1, 8),
(8, 9, 21),
(1, 4, 28),
(7, 6, 29),
(6, 10, 22),
(3, 5, 27);

-- --------------------------------------------------------

--
-- Table structure for table `Staff`
--

CREATE TABLE IF NOT EXISTS `Staff` (
  `Staff_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(40) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Pass` varchar(40) NOT NULL,
  PRIMARY KEY (`Staff_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `Staff`
--

INSERT INTO `Staff` (`Staff_ID`, `Name`, `Role`, `Username`, `Pass`) VALUES
(2, 'Echo Blanchard', 'Sales Person', 'turpis@malesuadavel.org', 'et'),
(1, 'Jin Townsend', 'Sales Person', 'dolor.Fusce.mi@nec.co.uk', 'Aliquam'),
(3, 'Acton George', 'Sales Person', 'sit@in.com', 'ut'),
(4, 'Griffith Pugh', 'Manager', 'Donec.vitae@eunibh.com', 'auctor'),
(5, 'Cameron Davis', 'Manager', 'nisi.a@Suspendisse.ca', 'nunc'),
(6, 'Regina Rasmussen', 'Manager', 'ut.cursus@gravida.com', 'neque'),
(7, 'Libby Kirkland', 'Owner', 'luctus.felis.purus@sitametluct', 'at'),
(8, 'Tatum Velasquez', 'Owner', 'netus.et@Proin.edu', 'magna,'),
(9, 'Melissa Bass', 'Owner', 'cursus.a@lacuspedesagittis.com', 'scelerisque,'),
(10, 'Sydnee Schroeder', 'Sales Person', 'euismod@Maurismagna.com', 'hymenaeos.');

-- --------------------------------------------------------

--

