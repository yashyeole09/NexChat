package com.nexchat.repository;

import com.nexchat.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m WHERE m.room.id = :roomId AND m.deleted = false ORDER BY m.createdAt DESC")
    Page<Message> findByRoomId(@Param("roomId") String roomId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.room.id = :roomId AND m.content LIKE %:query% AND m.deleted = false")
    List<Message> searchInRoom(@Param("roomId") String roomId, @Param("query") String query);

    long countByRoomIdAndDeletedFalse(String roomId);
}
