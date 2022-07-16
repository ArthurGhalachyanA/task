/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50733
 Source Host           : localhost:3306
 Source Schema         : taskdb

 Target Server Type    : MySQL
 Target Server Version : 50733
 File Encoding         : 65001

 Date: 16/07/2022 18:54:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for positions_list
-- ----------------------------
DROP TABLE IF EXISTS `positions_list`;
CREATE TABLE `positions_list`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` tinyint(3) UNSIGNED NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of positions_list
-- ----------------------------
INSERT INTO `positions_list` VALUES (1, 'position 1', 1);
INSERT INTO `positions_list` VALUES (2, 'position 2', 1);
INSERT INTO `positions_list` VALUES (3, 'position 3', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` enum('mentor','mentee') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `position_id` tinyint(3) UNSIGNED NOT NULL,
  `description` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `education` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `experience` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `about` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (35, 1, 'ffffff', 'asdasda', 'user@mail.com', 'c0b23ab96d27916a824c23d16ffb2a54055f3d3c', 'mentor', 1, '', '', '', '', '2022-07-16 16:44:58');
INSERT INTO `users` VALUES (36, 1, 'sdfsdf', 'asdasdsa', 'user1@mail.com', 'c0b23ab96d27916a824c23d16ffb2a54055f3d3c', 'mentor', 1, '', '', '', '', '2022-07-16 16:49:15');
INSERT INTO `users` VALUES (37, 1, 'sdfsdf', 'asdasdsa', 'useuuuur1@mail.com', 'c0b23ab96d27916a824c23d16ffb2a54055f3d3c', 'mentor', 1, '', '', '', '', '2022-07-16 18:20:15');
INSERT INTO `users` VALUES (38, 1, 'ffffff', 'asdasda', 'useuddduuur1@mail.com', 'c0b23ab96d27916a824c23d16ffb2a54055f3d3c', 'mentor', 1, '', '', '', '', '2022-07-16 18:22:40');

SET FOREIGN_KEY_CHECKS = 1;
