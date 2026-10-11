-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quanlydoan
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'acc0a998-3e66-11f1-b3ea-f02f74a06d53:1-10459';

--
-- Table structure for table `dangky`
--

DROP TABLE IF EXISTS `dangky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dangky` (
  `MDT` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MSV` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NGAY_DANG_KY` datetime NOT NULL,
  `TRANG_THAI` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'CHO_DUYET',
  PRIMARY KEY (`MDT`,`MSV`),
  KEY `FK_DANGKY_SINHVIEN` (`MSV`),
  CONSTRAINT `FK_DANGKY_DETAI` FOREIGN KEY (`MDT`) REFERENCES `detai` (`MDT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_DANGKY_SINHVIEN` FOREIGN KEY (`MSV`) REFERENCES `sinhvien` (`MSV`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dangky`
--

LOCK TABLES `dangky` WRITE;
/*!40000 ALTER TABLE `dangky` DISABLE KEYS */;
/*!40000 ALTER TABLE `dangky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detai`
--

DROP TABLE IF EXISTS `detai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detai` (
  `MDT` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TENDT` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MOTA` text COLLATE utf8mb4_unicode_ci,
  `GIANGVIEN_HUONGDAN` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SO_LUONG_TOI_DA` int DEFAULT '1',
  `TRANG_THAI` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'MO',
  PRIMARY KEY (`MDT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detai`
--

LOCK TABLES `detai` WRITE;
/*!40000 ALTER TABLE `detai` DISABLE KEYS */;
/*!40000 ALTER TABLE `detai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sinhvien`
--

DROP TABLE IF EXISTS `sinhvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sinhvien` (
  `MSV` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TENSV` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `KHOA` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DIEMTB` decimal(3,2) DEFAULT NULL,
  `LOP` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EMAIL` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MATKHAU` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VAITRO` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SINHVIEN',
  PRIMARY KEY (`MSV`),
  UNIQUE KEY `EMAIL` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sinhvien`
--

LOCK TABLES `sinhvien` WRITE;
/*!40000 ALTER TABLE `sinhvien` DISABLE KEYS */;
INSERT INTO `sinhvien` VALUES ('123456789','Admin',NULL,NULL,NULL,'admin@gmail.com','$2b$10$mbEh5syUfdSxKBZoU1unbutSemxoAj7fO.g3JHE31FeIrdPBmC5Na','ADMIN'),('4651050279','Nguyễn Thành Toàn',NULL,NULL,NULL,'4651050279@st.qnu.edu.vn','$2b$10$wv1N0nL2p.bXBpA81n9ZjeDzZ/vzRyMEnF7bY2mSgP53B4QEBJNLu','SINHVIEN'),('4651050280','Nguyễn Minh Tới',NULL,NULL,NULL,'toi@gmail.com','$2b$10$vqXqquK5cPX1.nJTUROpqe/GcT2kxdUVE9PhvN2nxpjZM56Tk6Qqu','SINHVIEN'),('4651050313','Trần Thị Ánh Tuyết',NULL,NULL,NULL,'tuyet4651050313@st.qnu.edu.vn','$2b$10$jPhcaJjtmdhhfFEicpsszeBDT8E6ey2LWl6SLlHBbkY.7GJOH/7Eu','SINHVIEN'),('4651050330','Test',NULL,NULL,NULL,'Test@gmail.com','$2b$10$lS0p//IAqR1N5S0WH8Nk7.ZbX/Cmhd82mGJNAgRnkWhtKeIqXOrTe','SINHVIEN'),('4651050332','Võ Kế Vương',NULL,NULL,NULL,'4651050332@gmail.com','$2b$10$yUKxB02npZzn.M6L0vs/COrFB6fhaqtfSte9HsPvStqnYdBTURDxq','SINHVIEN'),('SV001','Nguyễn Văn A','Công nghệ thông tin',8.50,'CNTT46A','sv001@gmail.com','$2b$10$bDyF7PzLyQpWKjYzUgKhLOFU2RIhTlMmhRhyMIMbDEKn3/2jahDAO','SINHVIEN'),('SV002','Trần Thị B','Công nghệ thông tin',9.00,'CNTT46A','sv002@gmail.com',NULL,'SINHVIEN'),('SV003','Võ Kế Vương','Công nghệ thông tin',8.75,'CNTT46A','sv003@gmail.com','$2b$10$hwcl8BADQRE7zCLzwtxVF.B.AaMlxXCqxjwJR/9jpSpIUjtrtl.lq','ADMIN'),('SV004','Lê Thị C','Công nghệ thông tin',8.20,'CNTT 46F','sv004@gmail.com','$2b$10$bDyF7PzLyQpWKjYzUgKhLOFU2RIhTlMmhRhyMIMbDEKn3/2jahDAO','SINHVIEN'),('SV005','Nguyễn Văn D','Công nghệ Thông tin',NULL,'CNTT K46A','sv005@gmail.com','$2b$10$H2dTFhvmUfFAzz2Wydnw.uMAWGqT9OHwcdDmXMizNSRzNoME5yrSy','SINHVIEN');
/*!40000 ALTER TABLE `sinhvien` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-04  8:55:08
