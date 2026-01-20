# # ---------- BUILD ----------
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # ---------- RUN ----------
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80

# Use Node image for build
# Use Node image to build
# Build stage
# FROM node:18 AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .



# # 🔴 ENSURE prod env is used
# # ENV VITE_API_BASE_URL=http://3.7.254.140:5000
# ENV VITE_API_BASE_URL=/api


# RUN npm run build

# # Production stage
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf


# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
