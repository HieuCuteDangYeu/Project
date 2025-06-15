/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Document, Model, Types, UpdateQuery } from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Create a new document
   */
  async create(createDto: any): Promise<T> {
    await this.validateCreate(createDto);
    const created = new this.model(createDto);
    return created.save();
  }

  /**
   * Find all documents with pagination
   */
  async findAll(options: PaginationOptions): Promise<PaginatedResult<T>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit).exec(),
      this.model.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: results,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Find one document by ID
   */
  async findOne(id: Types.ObjectId, populate?: string | string[]): Promise<T> {
    let query = this.model.findById(id);

    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((field) => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(populate);
      }
    }

    const document = await query.exec();

    if (!document) {
      throw new NotFoundException(
        `${this.getModelName()} with ID "${id.toString()}" not found.`,
      );
    }

    return document;
  }

  /**
   * Update a document by ID
   */
  async update(id: Types.ObjectId, updateDto: UpdateQuery<T>): Promise<T> {
    await this.validateUpdate(id, updateDto);

    const existingDocument = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!existingDocument) {
      throw new NotFoundException(
        `${this.getModelName()} with ID "${id.toString()}" not found.`,
      );
    }

    return existingDocument;
  }

  /**
   * Remove a document by ID
   */
  async remove(id: Types.ObjectId): Promise<{ message: string }> {
    await this.validateRemove(id);

    const result = await this.model.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `${this.getModelName()} with ID "${id.toString()}" not found.`,
      );
    }

    return {
      message: `${this.getModelName()} with ID "${id.toString()}" successfully removed.`,
    };
  }

  /**
   * Check if document exists by ID
   */
  async exists(id: Types.ObjectId): Promise<boolean> {
    const document = await this.model.findById(id).select('_id').exec();
    return !!document;
  }

  /**
   * Get model name for error messages
   */
  protected getModelName(): string {
    return this.model.modelName;
  }

  /**
   * Override this method to add custom validation before create
   */
  protected async validateCreate(createDto: any): Promise<void> {
    // Default implementation - no validation
    // Override in child classes for custom validation
  }

  /**
   * Override this method to add custom validation before update
   */
  protected async validateUpdate(
    id: Types.ObjectId,
    updateDto: any,
  ): Promise<void> {
    // Default implementation - no validation
    // Override in child classes for custom validation
  }

  /**
   * Override this method to add custom validation before remove
   */
  protected async validateRemove(id: Types.ObjectId): Promise<void> {
    // Default implementation - no validation
    // Override in child classes for custom validation
  }
}
