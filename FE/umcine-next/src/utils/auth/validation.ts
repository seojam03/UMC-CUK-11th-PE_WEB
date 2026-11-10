// 입력값 전체가 조건을 만족하는지 볼 때는 g 플래그를 붙이지 않아요.
// g가 있으면 test()가 lastIndex를 기억해서 같은 값도 호출할 때마다 결과가 달라져요.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 (6주차 서버 규칙과 같아요)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 12;

function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

function isValidPassword(password: string) {
  return PASSWORD_REGEX.test(password);
}

function isValidNickname(nickname: string) {
  const length = nickname.trim().length;
  return length >= NICKNAME_MIN_LENGTH && length <= NICKNAME_MAX_LENGTH;
}

export { isValidEmail, isValidNickname, isValidPassword, NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH };
