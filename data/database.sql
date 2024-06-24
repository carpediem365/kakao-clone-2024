CREATE TABLE `user` (
  `user_id` varchar(100) NOT NULL COMMENT 'user_id. user_id',
  `password` varchar(100) NOT NULL COMMENT 'password. password',
  `phone_number` varchar(50) NOT NULL COMMENT 'phone_num. phone_num',
  `name` varchar(50) NOT NULL COMMENT 'name. name',
  `status_message` varchar(100) DEFAULT NULL COMMENT 'status_msg. status_msg',
  `profile_img_url` varchar(150) DEFAULT NULL,
  `background_img_url` varchar(150) DEFAULT NULL COMMENT 'background_img_url. background_img_url',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'createdAt. createdAt',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'updatedAt. updateAt',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='User';

CREATE TABLE `participant` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` varchar(100) NOT NULL COMMENT 'user_id',
  `room_id` int unsigned NOT NULL COMMENT 'room_id',
  `room_name` varchar(50) DEFAULT NULL COMMENT 'room_name',
  `unread_chat_count` int unsigned DEFAULT NULL COMMENT 'not_read_chat',
  `last_read_chat_id` int unsigned DEFAULT NULL COMMENT 'last_read_chat_id',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'createdAt',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'updatedAt',
  `visible` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`,`user_id`,`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `friend` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `my_id` varchar(100) NOT NULL COMMENT 'my_id',
  `friend_id` varchar(100) DEFAULT NULL COMMENT 'friend_id',
  `friend_name` varchar(50) DEFAULT NULL COMMENT 'friend_name',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'createdAt',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'updatedAt',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Friend';

CREATE TABLE `chatting_room` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'room_id',
  `identifier` varchar(50) DEFAULT NULL COMMENT 'identifier',
  `type` varchar(50) DEFAULT NULL COMMENT 'type',
  `last_chat` text COMMENT 'last_chat',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'createdAt',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'updatedAt',
  `visible` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `chatting` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'chat_id',
  `room_id` int unsigned NOT NULL COMMENT 'room_id',
  `sender_id` varchar(100) NOT NULL COMMENT 'send_user_id',
  `message` varchar(150) DEFAULT NULL COMMENT 'MESSAGE',
  `unread_count` varchar(50) DEFAULT NULL COMMENT 'not_read',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'createdAt',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'updatedAt',
  PRIMARY KEY (`id`,`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
