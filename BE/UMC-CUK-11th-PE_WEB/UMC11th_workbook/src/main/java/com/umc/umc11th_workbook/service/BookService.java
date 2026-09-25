package com.umc.umc11th_workbook.service;

import com.umc.umc11th_workbook.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

  // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
  private final BookRepository bookRepository;

  public List<Map<String, Object>> getAllBooks() {
    // 지금은 별도 가공 없이 창고지기가 가져온 도서 목록을 그대로 반환합니다.
    return bookRepository.findAll();
  }

  public List<Map<String, Object>> getBooksByCategory(Long categoryId) {
    // 카테고리별 도서 목록을 가져오는 로직을 구현합니다.
    // 현재는 단순히 모든 도서를 반환하지만, 실제로는 categoryId를 활용하여 필터링해야 합니다.
    return bookRepository.findByCategory(categoryId); // 이 부분은 실제 구현에 맞게 수정 필요
  }

  public void createBook(Map<String, Object> body){
    bookRepository.save(body);
  }

  public void rentBook(Map<String, Object> body) {
    // 여기에 도서 대여 로직을 구현합니다.
     bookRepository.rentBook(body);
  }
}