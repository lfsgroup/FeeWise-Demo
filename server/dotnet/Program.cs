using Server;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FeeWiseOptions>(builder.Configuration.GetSection("FeeWise"));

// Add services to the container.
builder.Host.ConfigureServices((_, services) =>
{
    services.AddSingleton<IFeeWiseProxy, FeeWiseProxy>();
});

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Default",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000");
                          policy.WithHeaders("Content-Type");
                      });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Default");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
