package com.nexchat.repository;

import com.nexchat.entity.ChatRoom;
import com.nexchat.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    @Query("SELECT r FROM ChatRoom r JOIN r.members m WHERE m.id = :userId ORDER BY r.updatedAt DESC")
    List<ChatRoom> findRoomsByUserId(@Param("userId") String userId);

    @Query("SELECT r FROM ChatRoom r JOIN r.members m1 JOIN r.members m2 WHERE m1.id = :userId1 AND m2.id = :userId2 AND r.type = 'DIRECT'")
    Optional<ChatRoom> findDirectRoom(@Param("userId1") String userId1, @Param("userId2") String userId2);

    List<ChatRoom> findByType(RoomType type);

    @Query("SELECT r FROM ChatRoom r WHERE r.name LIKE %:query%")
    List<ChatRoom> searchRooms(@Param("query") String query);
}
