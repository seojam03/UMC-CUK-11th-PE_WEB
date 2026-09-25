// src/main/java/com/umc/umc11th_workbook/repository/BookRepository.java
package com.umc.umc11th_workbook.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 "나 창고지기 부품이야!"라고 등록
@RequiredArgsConstructor
public class BookRepository {

  // 2단계에서 준비된 스프링의 DB 통신 도구(JdbcTemplate) 주입
  private final JdbcTemplate jdbcTemplate;

  public List<Map<String, Object>> findAll() {
    String sql = "SELECT * FROM book";

    // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
    // Map의 Key는 '컬럼명(title)', Value는 '실제 데이터(달빛 도서관)'가 됩니다.
    return jdbcTemplate.queryForList(sql);
  }

  public List<Map<String, Object>> findByCategory(Long categoryId) {
    String sql = "SELECT * FROM book WHERE category_id = ?";

    // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
    return jdbcTemplate.queryForList(sql, categoryId);
  }

  public void save(Map<String, Object> body){
    // book_id는 AUTO_INCREMENT이므로 생략, is_available은 기본 true로 삽입
    String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

    // SQL 뒤에 파라미터를 차례대로 넘겨주면 ? 자리에 순서대로 안전하게 바인딩됩니다.
    jdbcTemplate.update(
        sql,
        body.get("categoryId"),
        body.get("title"),
        body.get("description")
    );
  }

  public void rentBook(Map<String, Object> body) {
    // 도서 대여 로직을 구현합니다.
    // 예를 들어, book_id를 받아서 해당 도서의 is_available을 false로 업데이트하는 쿼리를 작성할 수 있습니다.
    String sql = "INSERT INTO rental (rental_id, user_id, book_id, rented_at, due_at, returned_at) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)";

    jdbcTemplate.update(
        sql,
        body.get("rentalId"),
        body.get("userId"),
        body.get("bookId")
    );
  }
}