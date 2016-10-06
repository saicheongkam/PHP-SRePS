CREATE DATABASE IF NOT EXISTS `sreps2` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `srep2`;

CREATE TABLE `Batch` (
  `Batch_ID` int(11) NOT NULL,
  `Product_ID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `ExpiryDate` date NOT NULL,
  `Shelf` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Batch`
--

INSERT INTO `Batch` (`Batch_ID`, `Product_ID`, `Quantity`, `ExpiryDate`, `Shelf`) VALUES
(11, 108, 50, '2018-07-09', '49781-114'),
(12, 83, 10, '2017-10-20', '59579-002'),
(13, 124, 48, '2018-01-05', '67938-102'),
(14, 49, 23, '2018-05-01', '49643-438'),
(15, 101, 20, '2019-09-01', '55154-3436'),
(16, 127, 48, '2018-02-18', '41520-410'),
(17, 87, 12, '2017-11-25', '36987-2513'),
(18, 42, 22, '2018-03-14', '52125-394'),
(19, 67, 36, '2019-04-24', '55301-623'),
(20, 69, 48, '2018-07-28', '52584-155'),
(21, 95, 18, '2019-02-14', '60505-6030'),
(22, 75, 37, '2018-02-01', '68877-001'),
(23, 111, 5, '2018-06-09', '0179-0034'),
(24, 109, 43, '2018-06-08', '0003-5178'),
(25, 96, 39, '2017-12-04', '48951-9005'),
(26, 106, 18, '2018-06-21', '61715-092'),
(27, 57, 17, '2019-05-27', '63481-687'),
(28, 125, 16, '2019-07-24', '53808-0928'),
(29, 47, 48, '2018-12-07', '54312-270'),
(30, 61, 3, '2017-12-12', '0904-6111'),
(31, 48, 50, '2018-04-09', '0031-8724'),
(32, 82, 25, '2018-10-09', '54569-1444'),
(33, 67, 39, '2018-05-15', '36987-2255'),
(34, 115, 10, '2018-09-21', '63629-4121'),
(35, 92, 31, '2019-08-19', '0264-7612'),
(36, 33, 45, '2018-01-19', '61481-0020'),
(37, 61, 5, '2018-03-12', '16571-213'),
(38, 73, 9, '2017-10-25', '42549-659'),
(39, 120, 3, '2018-07-27', '49999-755'),
(40, 78, 14, '2018-11-29', '68737-225'),
(41, 84, 26, '2018-03-22', '68258-7013'),
(42, 94, 32, '2019-01-04', '63941-670'),
(43, 49, 27, '2018-04-21', '43353-684'),
(44, 64, 5, '2019-07-31', '0268-1503'),
(45, 127, 23, '2018-03-15', '54569-1923'),
(46, 85, 9, '2017-10-03', '76229-345'),
(47, 37, 32, '2019-07-05', '49999-895'),
(48, 47, 20, '2019-06-20', '55322-0001'),
(49, 43, 9, '2019-04-16', '60760-072'),
(50, 93, 19, '2017-12-21', '10702-005'),
(51, 85, 10, '2019-07-13', '51060-027'),
(52, 43, 4, '2019-05-11', '10596-132'),
(53, 67, 9, '2019-01-21', '17156-067'),
(54, 110, 50, '2018-06-06', '65903-250'),
(55, 58, 26, '2018-01-16', '14783-312'),
(56, 101, 21, '2017-12-25', '10812-304'),
(57, 96, 10, '2018-07-05', '49884-561'),
(58, 93, 38, '2019-08-04', '36987-3398'),
(59, 63, 41, '2019-02-12', '32909-723'),
(60, 115, 48, '2019-06-23', '54868-5842');

-- --------------------------------------------------------

--
-- Table structure for table `Drug`
--

CREATE TABLE `Drug` (
  `Drug_ID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Drug`
--

INSERT INTO `Drug` (`Drug_ID`, `Name`) VALUES
(14, 'Lisinopril'),
(15, 'beclomethasone'),
(16, 'Oxycodone'),
(17, 'Neomycin'),
(18, 'Fenofibrate'),
(19, 'Sodium Fluoride'),
(20, 'Dextromethorphan'),
(21, 'Hydroxyzine Pamoate'),
(22, 'Citalopram'),
(23, 'Ibuprofen'),
(24, 'Penicillin G Potassium'),
(25, 'simvastatin'),
(26, 'hydroxyzine hydrochloride'),
(27, 'Titanium Dioxide'),
(28, 'ampicillin sodium'),
(29, 'Polyethylene'),
(30, 'Lorazepam'),
(31, 'Zinc Oxide'),
(32, 'Argentum 8'),
(33, 'estradiol'),
(34, 'PANCRELIPASE'),
(35, 'Fentanyl Citrate'),
(36, 'Isopropyl Alcohol'),
(37, 'sertraline hydrochloride'),
(38, 'TRICLOCARBAN'),
(39, 'Oxacillin'),
(40, 'Salicylate'),
(41, 'Gentian Violet 1%'),
(42, 'California Mugwort'),
(43, 'Acetaminophen'),
(44, 'Salicylic Acid'),
(45, 'naphazoline hydrochloride'),
(46, 'acetaminophen'),
(47, 'OXYGEN'),
(48, 'Aspirin'),
(49, 'ADENOSINE DIMETHICONE'),
(50, 'Doxorubicin Hydrochloride'),
(51, 'Octinoxate and Avobenzone'),
(52, 'Polyethylene Glycol 3350'),
(53, 'Dicyclomine hydrochloride'),
(54, 'METAXALONE'),
(55, 'Oxycodone and Acetaminophen'),
(56, 'Dimethicone'),
(57, 'Dimethicine'),
(58, 'Dimethicox'),
(59, 'Miconazole nitrate');

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `Product_ID` int(11) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `ReorderLevel` int(11) DEFAULT NULL,
  `Supplier` varchar(100) NOT NULL,
  `UnitPrice` decimal(15,2) NOT NULL,
  `Drug_ID` int(11) NOT NULL,
  `Type_ID` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`Product_ID`, `Description`, `ReorderLevel`, `Supplier`, `UnitPrice`, `Drug_ID`, `Type_ID`) VALUES
(31, 'DIGOX', 13, 'Unit Dose Services', '12.89', 28, 16),
(32, 'Purminerals 4 in 1 Makeup SPF 15 Deep', 17, 'PUR MINERALS', '47.56', 29, 17),
(33, 'SyImmune', 10, 'Syntrion GmbH', '29.67', 31, 16),
(34, 'SEPIA OFFICINALIS', 15, 'REMEDY MAKERS', '24.98', 20, 17),
(35, 'Compact Hand Sanitizer', 15, 'INNOVATION SPECIALTIES', '23.44', 24, 5),
(36, 'Rash Relief Antifungal', 15, 'Touchless Care Concepts LLC', '36.66', 15, 12),
(37, 'Fresh Lime Antibacterial Foaming Hand Wash', 20, 'SJ Creations, Inc.', '19.48', 28, 6),
(38, 'Dolce and Gabbana The Lift Foundation Caramel 110', 17, 'Procter & Gamble Manufacturing Company', '49.48', 38, 14),
(39, 'Trihexyphenidyl Hydrochloride', 10, 'State of Florida DOH Central Pharmacy', '14.65', 37, 2),
(40, 'ROPINIROLE HYDROCHLORIDE', 18, 'STAT RX USA LLC', '23.14', 22, 16),
(41, 'AMOXICILLIN', 17, 'DIRECT RX', '17.55', 33, 6),
(42, 'Clarifying Colloidal Sulfur Mask', 14, 'Dr. Dennis Gross Skincare, LLC', '27.12', 20, 5),
(43, 'Gabapentin', 10, 'Ranbaxy Pharmaceuticals Inc.', '31.38', 29, 13),
(44, 'Good Sense Nicotine', 13, 'L Perrigo Company', '10.69', 31, 6),
(45, 'Gleevec', 15, 'Novartis Pharma Produktions GmbH', '33.27', 16, 9),
(46, 'Prevacid', 14, 'Bryant Ranch Prepack', '11.71', 25, 6),
(47, 'Pedia-Lax', 10, 'C.B. Fleet Company, Inc.', '49.91', 38, 17),
(48, 'Metoprolol Tartrate', 17, 'Sandoz Inc', '35.65', 31, 5),
(49, 'Cleansing Foaming Gel', 10, 'LANGE SAS', '43.10', 22, 10),
(50, 'Safe Sea Sunscreen With Jellyfish Sting Protective SPF 15', 19, 'Nidaria Technology Ltd.', '29.04', 35, 13),
(51, 'ACZONE', 15, 'Allergan, Inc.', '29.05', 29, 10),
(52, 'Eczema Headache', 14, 'Natural Health Supply', '48.04', 38, 7),
(53, 'Terrasil Cold Sore Treatment', 13, 'Aidance Skincare & Topical Solutions, LLC', '47.97', 31, 5),
(54, 'Warfarin Sodium', 16, 'Physicians Total Care, Inc.', '28.65', 38, 13),
(55, 'Dicyclomine', 19, 'H.J. Harkins Company, Inc.', '38.85', 26, 7),
(56, 'Medicated Chest Rub', 12, 'Family Dollar Services Inc', '24.16', 38, 9),
(57, 'Sulfacetamide Sodium', 14, 'Akorn, Inc.', '21.48', 35, 13),
(58, 'Silver Maple Pollen', 18, 'Allermed Laboratories, Inc.', '26.16', 35, 7),
(59, 'Boscia All In One B.B. Eye Brightener Broad Spectrum SPF 20', 16, 'Boscia LLC', '26.03', 35, 2),
(60, 'Lisinopril', 10, 'Aphena Pharma Solutions - Tennessee, LLC', '24.22', 23, 15),
(61, 'Care One Medicated Lip Balm in a Pot', 16, 'American Sales Company', '43.25', 17, 14),
(62, 'Glipizide', 17, 'Watson Laboratories, Inc.', '23.72', 33, 9),
(63, 'acyclovir', 10, 'Apotex Corp.', '34.56', 14, 12),
(64, 'Fluoxetine', 13, 'Aurobindo Pharma Limited', '24.55', 17, 7),
(65, 'Metformin Hydrochloride', 12, 'Aphena Pharma Solutions - Tennessee, LLC', '37.98', 38, 3),
(66, 'OXYGEN', 16, 'Medical Home Care, Inc', '19.24', 36, 17),
(67, 'Leader Nicotine', 12, 'Cardinal Health', '19.99', 23, 12),
(68, 'Levofloxacin', 19, 'American Health Packaging', '31.13', 24, 2),
(69, 'No7 Protect and Perfect Day Sunscreen Broad Spectrum SPF 15', 12, 'BCM Ltd', '22.52', 29, 2),
(70, 'A.H.C. C-TONER', 14, 'Carver Korea Co.,Ltd', '38.91', 15, 14),
(71, 'Molds, Rusts and Smuts, Cephalosporium acremonium', 20, 'Jubilant HollisterStier LLC', '10.93', 18, 5),
(72, 'Kapok', 20, 'Nelco Laboratories, Inc.', '17.82', 25, 1),
(73, 'Lorazepam', 11, 'Ranbaxy Pharmaceuticals Inc.', '12.94', 31, 17),
(74, 'Hackberry', 13, 'Nelco Laboratories, Inc.', '20.37', 19, 8),
(75, '4-N-1 WASH', 11, 'DermaRite Industries, LLC', '40.71', 24, 8),
(76, 'Piperacillin and Tazobactam', 10, 'Cardinal Health', '48.43', 18, 17),
(77, 'Potassium Chloride in Sodium Chloride', 19, 'Hospira, Inc.', '10.02', 19, 16),
(78, 'Loperamide Hydrochloride', 16, 'Shopko Stores Operating Co., LLC', '15.85', 19, 9),
(79, 'Effexor', 12, 'Physicians Total Care, Inc.', '23.83', 15, 6),
(80, 'Lidocaine Hydrochloride and Dextrose', 10, 'Hospira, Inc.', '14.34', 33, 2),
(81, 'Carvedilol', 20, 'REMEDYREPACK INC.', '41.69', 36, 11),
(82, 'Ondansetron', 17, 'Aurobindo Pharma Limited', '38.69', 24, 14),
(83, 'Female Fibroids', 13, 'Newton Laboratories, Inc.', '49.58', 14, 16),
(84, 'HAVRIX', 17, 'GlaxoSmithKline Biologicals SA', '19.75', 14, 3),
(85, 'Obao Men Active', 16, 'Cosbel S.A de C.V.', '45.71', 14, 14),
(86, 'TUSSICAPS', 16, 'Physicians Total Care, Inc.', '27.55', 22, 13),
(87, 'CVS Antiseptic Wash', 15, 'CVS Pharmacy', '47.65', 20, 2),
(88, 'Headache Relief', 17, 'TOP CARE (Topco Associates LLC)', '21.95', 15, 8),
(89, 'Fluoxetine', 20, 'Lake Erie Medical DBA Quality Care Products LLC', '45.99', 37, 3),
(90, 'Tarka', 17, 'Physicians Total Care, Inc.', '18.37', 20, 5),
(91, 'germstarNORO', 15, 'Soaptronic, LLC', '31.59', 16, 12),
(92, 'Neutrogena MoistureShine SPF20', 12, 'Neutrogena Corporation', '10.27', 25, 11),
(93, 'CHAPSTICK CLASSICS CHERRY', 11, 'Pfizer Consumer Healthcare', '10.37', 32, 9),
(94, 'Nicotine', 18, 'Safeway', '26.79', 32, 10),
(95, 'SNAIL THERAPY 1000 HYDROGEL MASK SHEET', 12, 'NATURE REPUBLIC CO., LTD.', '34.89', 31, 10),
(96, 'Leader Chest Congestion Relief Plus DMDM', 15, 'Cardinal Health', '11.31', 16, 6),
(97, 'Rizatriptan Benzoate', 18, 'Mylan Pharmaceuticals Inc.', '13.02', 29, 5),
(98, 'Osteoplex', 20, 'BioActive Nutritional, Inc.', '37.80', 22, 8),
(99, 'ONDANSETRON', 13, 'REMEDYREPACK INC.', '26.51', 23, 17),
(100, 'RANITIDINE', 14, 'WOCKHARDT USA LLC.', '12.26', 17, 1),
(101, 'Ondansetron Hydrochloride', 12, 'Ascend Laboratories, LLC', '12.29', 18, 15),
(102, 'Meteoric Iron Phosphorus Quartz', 10, 'Uriel Pharmacy Inc.', '28.90', 35, 15),
(103, 'MIDAZOLAM HYDROCHLORIDE', 10, 'Physicians Total Care, Inc.', '29.70', 33, 17),
(104, 'Hydrocodone Bitartrate And Acetaminophen', 11, 'Aidarex Pharmaceuticals LLC', '31.48', 31, 5),
(105, 'Lofibra', 17, 'Teva Select Brands', '48.06', 18, 2),
(106, 'Go Smile', 19, 'Go Smile, Inc.', '37.49', 22, 12),
(107, 'Day Time with PE', 16, 'Aaron Industries, Inc.', '48.92', 38, 18),
(108, 'DELFLEX', 17, 'Fresenius Medical Care North America', '32.67', 35, 13),
(109, 'ZALEPLON', 20, 'Aurobindo Pharma Limited', '19.45', 23, 4),
(110, 'Ropinirole Hydrochloride', 20, 'Wockhardt Limited', '43.19', 28, 13),
(111, 'Topiramate', 12, 'Bryant Ranch Prepack', '33.06', 34, 1),
(112, 'VIROPTIC', 17, 'Pfizer Laboratories Div Pfizer Inc', '11.43', 18, 15),
(113, 'Gabapentin', 15, 'PD-Rx Pharmaceuticals, Inc.', '34.40', 32, 9),
(114, 'Sea Breeze Actives Deep-Clean Astringent', 16, 'Idelle Labs, Ltd', '14.49', 14, 1),
(115, 'GlyBURIDE', 15, 'DAVA Pharmaceuticals, Inc.', '24.35', 30, 6),
(116, 'ENALAPRIL MALEATE', 18, 'Preferred Pharmaceuticals, Inc.', '25.33', 21, 9),
(117, 'Equate vagicaine', 20, 'Wal-Mart Stores Inc', '19.54', 31, 1),
(118, 'Guanfacine', 20, 'Mylan Pharmaceuticals Inc.', '15.50', 20, 7),
(119, 'LEVOXYL', 16, 'Pfizer Laboratories Div Pfizer Inc', '33.29', 29, 16),
(120, 'Osmitrol', 15, 'Baxter Healthcare Corporation', '15.31', 14, 3),
(121, 'Diphenhydramine Hydrochloride', 16, 'REMEDYREPACK INC.', '11.15', 31, 5),
(122, 'Androgel', 14, 'AbbVie Inc.', '20.01', 23, 2),
(123, 'Power Base', 13, 'Bioelements, Inc.', '22.70', 27, 15),
(124, 'DIGOX', 16, 'Unit Dose Services', '25.77', 26, 8),
(125, 'Caffeine Citrate', 18, 'Paddock Laboratories, LLC', '41.74', 38, 5),
(126, 'PAIN RELIEVER PM', 12, 'Walgreens', '31.97', 36, 17),
(127, 'ESIKA Perfect Match', 18, 'Ventura Corporation LTD.', '29.03', 19, 3),
(128, 'Pravastatin Sodium', 16, 'Rebel Distributors Corp', '18.49', 16, 7),
(129, 'Metformin Hydrochloride', 13, 'MARKSANS PHARMA LIMITED', '46.73', 31, 12),
(130, 'Diagonam', 1, 'Diat Inc.', '0.00', 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `Sales`
--

CREATE TABLE `Sales` (
  `Sale_ID` int(11) NOT NULL,
  `SaleDate` date NOT NULL,
  `Amount` double NOT NULL,
  `Paid` double NOT NULL,
  `Change` double NOT NULL,
  `Staff_ID` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Sales`
--

INSERT INTO `Sales` (`Sale_ID`, `SaleDate`, `Amount`, `Paid`, `Change`, `Staff_ID`) VALUES
(37, '2016-09-04', 72.11, 174.09, 35, 4),
(38, '2016-02-06', 48.22, 260.74, 32, 6),
(39, '2016-08-21', 184.49, 293.56, 59, 10),
(40, '2016-08-10', 30.34, 19.02, 52, 7),
(41, '2015-12-06', 90.39, 44.38, 54, 6),
(42, '2016-02-18', 113.04, 150.12, 75, 2),
(43, '2016-06-22', 85.09, 254.29, 23, 9),
(44, '2016-07-12', 191.72, 96.41, 52, 8),
(45, '2016-02-08', 24.34, 293.79, 31, 9),
(46, '2015-09-27', 167.29, 285.46, 43, 2),
(47, '2016-06-17', 107.96, 234.23, 99, 2),
(48, '2015-11-27', 26.62, 28.96, 80, 8),
(49, '2016-05-15', 125.02, 257.18, 49, 3),
(50, '2015-12-03', 105.36, 54.92, 77, 7),
(51, '2015-10-18', 78.54, 35.03, 82, 2),
(52, '2015-12-14', 130.52, 274.12, 78, 6),
(53, '2016-07-26', 124.27, 231.42, 79, 5),
(54, '2016-06-19', 163.79, 230.48, 59, 5),
(55, '2016-02-05', 131.67, 65.44, 12, 4),
(56, '2015-12-06', 95.94, 297.48, 59, 8),
(57, '2015-10-14', 164.83, 258.05, 74, 3),
(58, '2016-06-29', 154.67, 116.7, 66, 4),
(59, '2016-05-10', 193.24, 19.31, 65, 6),
(60, '2016-01-22', 154.75, 219.88, 69, 10),
(61, '2016-08-28', 193.34, 109.5, 69, 6),
(62, '2016-05-21', 114.4, 257.84, 93, 5),
(63, '2016-04-09', 133.86, 13.69, 74, 4),
(64, '2015-10-17', 175.04, 278.96, 16, 5),
(65, '2015-12-18', 162.63, 209.65, 75, 2),
(66, '2016-03-30', 76.81, 77.89, 43, 4),
(67, '2016-01-08', 145.15, 225.05, 93, 2),
(68, '2015-10-07', 38.71, 250.35, 96, 2),
(69, '2016-06-14', 140.59, 120.97, 21, 9),
(70, '2016-08-17', 70.53, 116.57, 20, 9),
(71, '2016-01-15', 143.63, 245.73, 59, 7),
(72, '2016-06-30', 99.36, 233.37, 67, 8),
(73, '2016-06-18', 88.9, 129.85, 86, 6),
(74, '2016-04-22', 44.68, 91.36, 35, 3),
(75, '2016-01-09', 125.73, 157.2, 42, 9),
(76, '2016-05-28', 39.49, 271.81, 54, 3),
(77, '2016-05-24', 74.36, 233.85, 29, 6),
(78, '2016-08-25', 164.54, 219.23, 53, 10),
(79, '2016-01-17', 42.43, 243.79, 12, 4),
(80, '2016-05-29', 28.21, 221.26, 95, 6),
(81, '2015-09-16', 154.51, 142.28, 79, 7),
(82, '2016-03-28', 141.64, 69.07, 21, 6),
(83, '2016-01-21', 180.78, 297.4, 42, 4),
(84, '2015-12-26', 197.72, 255.36, 12, 5),
(85, '2016-05-03', 188.84, 219.31, 96, 9),
(86, '2016-07-14', 74.05, 244.21, 59, 3),
(87, '2016-09-08', 67.69, 70, 2.31, 1),
(88, '2016-09-08', 49.58, 50, 0.42, 1);

-- --------------------------------------------------------

--
-- Table structure for table `SalesItem`
--

CREATE TABLE `SalesItem` (
  `Sale_ID` int(11) NOT NULL,
  `Batch_ID` int(11) NOT NULL,
  `QuantitySold` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `SalesItem`
--

INSERT INTO `SalesItem` (`Sale_ID`, `Batch_ID`, `QuantitySold`) VALUES
(67, 50, 2),
(58, 50, 2),
(51, 52, 4),
(80, 15, 4),
(59, 43, 3),
(84, 59, 3),
(53, 21, 3),
(71, 36, 1),
(80, 14, 1),
(77, 46, 1),
(78, 48, 1),
(40, 24, 4),
(74, 50, 4),
(84, 39, 1),
(82, 49, 5),
(79, 35, 5),
(68, 42, 5),
(54, 42, 1),
(57, 35, 2),
(84, 55, 2),
(62, 40, 1),
(86, 45, 1),
(51, 39, 1),
(61, 48, 5),
(39, 40, 5),
(56, 23, 5),
(45, 47, 3),
(79, 12, 3),
(50, 23, 2),
(54, 51, 1),
(68, 29, 3),
(86, 36, 1),
(61, 19, 1),
(41, 57, 1),
(64, 51, 5),
(45, 45, 1),
(77, 36, 1),
(70, 51, 3),
(70, 39, 5),
(86, 33, 5),
(76, 58, 2),
(40, 59, 1),
(57, 22, 5),
(38, 30, 4),
(42, 55, 4),
(42, 59, 5),
(73, 34, 1),
(52, 27, 5),
(40, 53, 5),
(63, 22, 3),
(87, 31, 1),
(87, 41, 1),
(87, 56, 1),
(88, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Staff`
--

CREATE TABLE `Staff` (
  `Staff_ID` int(11) NOT NULL,
  `Name` varchar(40) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `Pass` varchar(40) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
(7, 'Libby Kirkland', 'Owner', 'luctus', 'at'),
(8, 'Tatum Velasquez', 'Owner', 'netus', 'magna,'),
(9, 'Melissa Bass', 'Owner', 'cursus', 'scelerisque,'),
(10, 'Sydnee Schroeder', 'Sales Person', 'euismod@Maurismagna.com', 'hymenaeos.');

-- --------------------------------------------------------

--
-- Table structure for table `Type`
--

CREATE TABLE `Type` (
  `Type_ID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Type`
--

INSERT INTO `Type` (`Type_ID`, `Name`, `Description`) VALUES
(2, 'antibiotic', 'a drug that cures illnesses and infections caused by bacteria. Doctors often give people a course of'),
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
(14, 'vitamin', 'a pill containing vitamins'),
(1, 'other', 'unspecified type'),
(15, 'ointment', 'a smooth oily substance that is rubbed on the skin'),
(16, 'contraceptive', 'a device or drug serving to prevent pregnancy.'),
(17, 'cream', 'a thick liquid or semi-solid medical preparation applied to the skin'),
(18, 'bandage', 'a strip of woven material used to bind up a wound or to protect an injured part of the body.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Batch`
--
ALTER TABLE `Batch`
  ADD PRIMARY KEY (`Batch_ID`),
  ADD KEY `Product_ID` (`Product_ID`);

--
-- Indexes for table `Drug`
--
ALTER TABLE `Drug`
  ADD PRIMARY KEY (`Drug_ID`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`Product_ID`),
  ADD KEY `fk_type_id` (`Type_ID`),
  ADD KEY `fk_Drug_ID` (`Drug_ID`);

--
-- Indexes for table `Sales`
--
ALTER TABLE `Sales`
  ADD PRIMARY KEY (`Sale_ID`),
  ADD KEY `Staff_ID` (`Staff_ID`);

--
-- Indexes for table `SalesItem`
--
ALTER TABLE `SalesItem`
  ADD PRIMARY KEY (`Sale_ID`,`Batch_ID`),
  ADD KEY `Batch_ID` (`Batch_ID`),
  ADD KEY `Sale_ID` (`Sale_ID`);

--
-- Indexes for table `Staff`
--
ALTER TABLE `Staff`
  ADD PRIMARY KEY (`Staff_ID`);

--
-- Indexes for table `Type`
--
ALTER TABLE `Type`
  ADD PRIMARY KEY (`Type_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Batch`
--
ALTER TABLE `Batch`
  MODIFY `Batch_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
--
-- AUTO_INCREMENT for table `Drug`
--
ALTER TABLE `Drug`
  MODIFY `Drug_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `Product`
--
ALTER TABLE `Product`
  MODIFY `Product_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;
--
-- AUTO_INCREMENT for table `Sales`
--
ALTER TABLE `Sales`
  MODIFY `Sale_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;
--
-- AUTO_INCREMENT for table `Staff`
--
ALTER TABLE `Staff`
  MODIFY `Staff_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `Type`
--
ALTER TABLE `Type`
  MODIFY `Type_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

UPDATE Staff
SET Pass='21232f297a57a5a743894a0e4a801fc3'
WHERE Role='Owner'; 