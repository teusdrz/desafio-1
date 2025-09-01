# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/Hypesoft.API/Hypesoft.API.csproj", "src/Hypesoft.API/"]
COPY ["src/Hypesoft.Application/Hypesoft.Application.csproj", "src/Hypesoft.Application/"]
COPY ["src/Hypesoft.Domain/Hypesoft.Domain.csproj", "src/Hypesoft.Domain/"]
COPY ["src/Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj", "src/Hypesoft.Infrastructure/"]

RUN dotnet restore "src/Hypesoft.API/Hypesoft.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/Hypesoft.API"
RUN dotnet build "Hypesoft.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Hypesoft.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

EXPOSE 5000

ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
