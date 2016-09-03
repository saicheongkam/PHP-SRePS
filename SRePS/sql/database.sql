-- phpMyAdmin SQL Dump
-- version 3.5.4
-- http://www.phpmyadmin.net
--
-- Host: mysql.ict.swin.edu.au:3306
-- Generation Time: Sep 03, 2016 at 06:23 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `php`
--
CREATE DATABASE `php` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `php`;

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
-- Table structure for table `Drug`
--

CREATE TABLE IF NOT EXISTS `Drug` (
  `Drug_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Drug_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `Drug`
--

INSERT INTO `Drug` (`Drug_ID`, `Name`) VALUES
(1, 'Stimulant'),
(2, 'Hallucinogan'),
(3, 'Anesthatic'),
(4, 'Inhalants'),
(5, 'Analgesics'),
(6, 'Cannabis'),
(7, 'Aminopenicillins'),
(8, 'Antibiotics'),
(9, 'antiandrogens'),
(10, 'Antineoplastics');

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE IF NOT EXISTS `Product` (
  `Product_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(40) NOT NULL,
  `ReorderLevel` int(11) DEFAULT NULL,
  `Supplier` varchar(15) NOT NULL,
  `UnitPrice` decimal(15,2) NOT NULL,
  `Drug_ID` int(11) NOT NULL,
  `Type_ID` int(11) NOT NULL,
  PRIMARY KEY (`Product_ID`),
  KEY `fk_type_id` (`Type_ID`),
  KEY `fk_Drug_ID` (`Drug_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`Product_ID`, `Description`, `ReorderLevel`, `Supplier`, `UnitPrice`, `Drug_ID`, `Type_ID`) VALUES
(1, 'Cymbalta', 24, 'Consectetuer In', '182.00', 7, 1),
(2, 'Doxycycline', 16, 'Consectetuer Eu', '174.00', 7, 2),
(3, 'Meth', 30, 'update', '170.00', 5, 3),
(4, 'Xanax', 25, 'Suspendisse Tri', '179.00', 8, 4),
(5, 'Pantoprazole', 22, 'Varius Orci In ', '51.00', 6, 5),
(6, 'Citalopram', 18, 'Lectus Quis Mas', '156.00', 8, 6),
(7, 'Alprazolam', 23, 'Orci Ut Sagitti', '102.00', 8, 7),
(8, 'Azithromycin', 24, 'Ipsum Primis In', '81.00', 1, 8),
(9, 'Ciprofloxacin', 25, 'Velit Sed Males', '100.00', 5, 9),
(10, 'Trazodone', 17, 'Sed Pede Cum Co', '165.00', 4, 10),
(11, 'Crystal Meth', 30, 'lknjna', '150.00', 3, 11),
(12, 'Crystal Meth', 30, 'lknjna', '150.00', 3, 12),
(13, 'Dop Meth', 30, 'lol', '150.00', 5, 1),
(14, 'LOL Meth', 30, 'lol', '150.00', 5, 2);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

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
(19, '2016-12-05', 135, 150, 50, 5),
(20, '2016-12-05', 155, 235, 80, 5),
(18, '2016-12-05', 135, 150, 50, 5),
(21, '2016-12-05', 300, 150, 50, 5),
(22, '2016-12-05', 300, 150, 50, 5);

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
(3, 5, 27),
(20, 1, 2),
(20, 2, 1),
(20, 3, 6),
(20, 4, 1),
(22, 1, 2),
(22, 2, 1),
(22, 3, 6),
(22, 4, 1);

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
-- Table structure for table `Type`
--

CREATE TABLE IF NOT EXISTS `Type` (
  `Type_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Type_ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `Type`
--

INSERT INTO `Type` (`Type_ID`, `Name`, `Description`) VALUES
(2, 'antibiotic ', 'a drug that cures illnesses and infections caused by bacteria. Doctors often give people a course of'),
(3, 'antihistamine', 'a drug used to treat an allergy'),
(4, 'capsule', 'a small round container filled with medicine that you swallow whole'),
(5, 'decongestant', 'a drug that helps you breathe more easily when you have a cold'),
(6, 'drops', 'liquid medicine that you put into your eyes, ears, or nose'),
(7, 'emetic', 'a substance that makes you vomit\n'),
(8, 'inhalant', 'a medicine or drug that you breathe into your lungs'),
(9, 'painkiller', 'a medicine that reduces pain'),
(10, 'prescription', 'a drug that you can only get if you have a prescription from your doctor'),
(11, 'syrup', 'a sweet liquid that contains medicine'),
(12, 'tablet', 'a small hard round piece of medicine that you swallow'),
(13, 'vaccine', 'a substance put into the body, usually by injection, in order to provide protection against a diseas'),
(14, 'vitamin', 'a pill containing vitamins');


