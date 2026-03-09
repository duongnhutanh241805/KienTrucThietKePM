# Base image
FROM python:3.9

# Thư mục làm việc
WORKDIR /app

# Copy source code
COPY app.py .

# Khai báo biến môi trường
ENV APP_ENV=development

# Chạy ứng dụng
CMD ["python", "app.py"]