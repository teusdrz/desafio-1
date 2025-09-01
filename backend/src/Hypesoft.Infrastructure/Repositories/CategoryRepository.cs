using Microsoft.EntityFrameworkCore;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;

namespace Hypesoft.Infrastructure.Repositories;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.Name == name, cancellationToken);
    }

    public async Task<IEnumerable<Category>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> HasProductsAsync(string categoryId, CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .AnyAsync(p => p.CategoryId == categoryId, cancellationToken);
    }

    public async Task<IEnumerable<Category>> GetCategoriesWithProductCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Products)
            .ToListAsync(cancellationToken);
    }

    public override async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Products)
            .ToListAsync(cancellationToken);
    }

    public override async Task<Category?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }
}
