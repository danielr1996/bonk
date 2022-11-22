FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /app
COPY settings.gradle settings.gradle
COPY gradlew gradlew
COPY build.gradle build.gradle
COPY gradle gradle
COPY src/ src
RUN ./gradlew jar

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/hbcigateway-1.0-SNAPSHOT.jar /app/hbcigateway.jar
CMD ["java","-jar","hbcigateway.jar"]
