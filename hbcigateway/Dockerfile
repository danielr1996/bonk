FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY settings.gradle settings.gradle
COPY gradlew gradlew
COPY build.gradle build.gradle
COPY gradle gradle
COPY src/ src

CMD ["./gradlew","run"]
