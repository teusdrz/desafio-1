using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface ICategoryRepository : IBaseRepository<Category>
{
    Task<Category?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<IEnumerable<Category>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<bool> HasProductsAsync(string categoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Category>> GetCategoriesWithProductCountAsync(CancellationToken cancellationToken = default);
}
