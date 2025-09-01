# Demo Users for Testing

## Available Test Accounts

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@hypesoft.com | admin123 | Admin | Full system access |
| manager@hypesoft.com | manager123 | Manager | Management operations |
| product@hypesoft.com | product123 | Product Manager | Product management |
| stock@hypesoft.com | stock123 | Stock Manager | Inventory control |
| reporter@hypesoft.com | reporter123 | Reporter | Read-only access |
| user@hypesoft.com | user123 | User | Basic user access |

## Usage Instructions

1. Navigate to http://localhost:3000/login
2. Select a demo user or enter credentials manually
3. Click login to access the system with role-based permissions

## API Testing

```bash
# Test backend API status
curl http://localhost:5000/api/status

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hypesoft.com","password":"admin123"}'
```
