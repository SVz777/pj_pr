CREATE TABLE `info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `in_time` bigint(20) NOT NULL DEFAULT '0',
  `out_time` bigint(20) NOT NULL DEFAULT '0',
  `plate` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(3) NOT NULL DEFAULT '0',
  `pay` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_plate` (`plate`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;