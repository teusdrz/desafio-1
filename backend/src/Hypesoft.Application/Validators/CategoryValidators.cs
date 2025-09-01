using FluentValidation;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Validators;

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required")
            .MaximumLength(50).WithMessage("Category name must not exceed 50 characters");

        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Category description must not exceed 200 characters");
    }
}

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required")
            .MaximumLength(50).WithMessage("Category name must not exceed 50 characters");

        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Category description must not exceed 200 characters");
    }
}
